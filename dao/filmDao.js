const db = require("../db/connection");

class FilmDao {
  // Haal alle films op
  getAllFilms(callback) {
    const sql = `SELECT film_id, title, description, release_year, language_id 
                 FROM film 
                 ORDER BY title 
                 LIMIT 100`;
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  // Haal film op id
  getFilmById(id, callback) {
    const sql = `
      SELECT f.*, l.name AS language_name
      FROM film f
      JOIN language l ON f.language_id = l.language_id
      WHERE f.film_id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  getFilmDetails(filmId, callback) {
    const filmQuery = `
    SELECT f.film_id, f.title, f.release_year, f.description, 
       f.length, f.rental_rate, f.rental_duration, f.replacement_cost, f.rating, 
       l.name as language_name
FROM film f
JOIN language l ON f.language_id = l.language_id
WHERE f.film_id = ?;
  `;

    db.query(filmQuery, [filmId], (err, filmRows) => {
      if (err) return callback(err);
      const film = filmRows[0];

      const actorsQuery = `
      SELECT a.first_name, a.last_name
      FROM actor a
      JOIN film_actor fa ON a.actor_id = fa.actor_id
      WHERE fa.film_id = ?;
    `;
      db.query(actorsQuery, [filmId], (err, actors) => {
        if (err) return callback(err);

        const categoriesQuery = `
        SELECT c.name
        FROM category c
        JOIN film_category fc ON c.category_id = fc.category_id
        WHERE fc.film_id = ?;
      `;
        db.query(categoriesQuery, [filmId], (err, categories) => {
          if (err) return callback(err);

          const storesQuery = `
          SELECT a.address, i.inventory_id,
       (i.inventory_id - IFNULL(r.rented_count,0)) AS available_copies
          FROM inventory i
          JOIN store s ON i.store_id = s.store_id
          JOIN address a ON s.address_id = a.address_id
          LEFT JOIN (
              SELECT inventory_id, COUNT(*) AS rented_count
              FROM rental
              WHERE return_date IS NULL
              GROUP BY inventory_id
          ) r ON i.inventory_id = r.inventory_id
          WHERE i.film_id = ?;
        `;
          db.query(storesQuery, [filmId], (err, stores) => {
            if (err) return callback(err);

            callback(null, { film, actors, categories, stores });
          });
        });
      });
    });
  }

  // Maak een nieuwe film
  createFilm(film, callback) {
    const {
      title,
      description,
      release_year,
      language_id,
      rental_duration,
      rental_rate,
      length,
      replacement_cost,
      rating,
    } = film;

    const sql = `
  INSERT INTO film 
    (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    db.query(
      sql,
      [
        title,
        description,
        release_year,
        language_id,
        rental_duration,
        rental_rate,
        length,
        replacement_cost,
        rating,
      ],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  }

  // Update film
  updateFilm(id, film, callback) {
    const { title, description, release_year, language_id } = film;

    const sql = `
      UPDATE film 
      SET title = ?, description = ?, release_year = ?, language_id = ?
      WHERE film_id = ?`;

    db.query(
      sql,
      [title, description, release_year, language_id, id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.affectedRows);
      }
    );
  }

  // Verwijder film (in juiste volgorde)
  deleteFilm(filmId, callback) {
    // Begin een transactie
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      connection.beginTransaction((err) => {
        if (err) return callback(err);

        const queries = [
          // Verwijder rentals
          {
            sql: `DELETE r FROM rental r
                JOIN inventory i ON r.inventory_id = i.inventory_id
                WHERE i.film_id = ?`,
          },
          // Verwijder inventory
          {
            sql: "DELETE FROM inventory WHERE film_id = ?",
          },
          // Verwijder film_actor koppelingen
          {
            sql: "DELETE FROM film_actor WHERE film_id = ?",
          },
          // Verwijder film_category koppelingen
          {
            sql: "DELETE FROM film_category WHERE film_id = ?",
          },
          // Verwijder de film zelf
          {
            sql: "DELETE FROM film WHERE film_id = ?",
          },
        ];

        const executeQuery = (index) => {
          if (index >= queries.length) {
            // Alle queries voltooid, commit
            return connection.commit((err) => {
              connection.release();
              if (err) return callback(err);
              callback(null, true);
            });
          }

          connection.query(queries[index].sql, [filmId], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }
            executeQuery(index + 1);
          });
        };

        executeQuery(0);
      });
    });
  }

  // Check beschikbaarheid van een film
  checkAvailability(filmId, callback) {
    const sql = `
      SELECT COUNT(*) AS available
      FROM inventory i
      LEFT JOIN rental r 
        ON i.inventory_id = r.inventory_id 
        AND r.return_date IS NULL
      WHERE i.film_id = ? AND r.rental_id IS NULL`;

    db.query(sql, [filmId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].available > 0);
    });
  }

  // Lijst films + beschikbaarheid
  listFilmsWithAvailability(callback) {
    const sql = `
      SELECT f.film_id, f.title, f.description, f.release_year,
        (SELECT COUNT(*) 
         FROM inventory i
         LEFT JOIN rental r 
           ON i.inventory_id = r.inventory_id 
           AND r.return_date IS NULL
         WHERE i.film_id = f.film_id 
           AND r.rental_id IS NULL) AS available_count
      FROM film f
      ORDER BY f.title`;

    db.query(sql, (err, results) => {
      if (err) return callback(err);
      results.forEach((f) => (f.available = f.available_count > 0));
      callback(null, results);
    });
  }

  // Haal alle beschikbare films op
  getAvailableFilms(callback) {
    const sql = `
      SELECT f.film_id, f.title
      FROM film f
      LEFT JOIN inventory i ON f.film_id = i.film_id
      LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      WHERE r.rental_id IS NULL
      GROUP BY f.film_id`;

    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  // Haal alle talen op
  getAllLanguages(callback) {
    const sql = "SELECT language_id, name FROM language ORDER BY name";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = new FilmDao();
