const db = require("../db/connection");

class FilmDao {
  getAllFilms(callback) {
    db.query("SELECT * FROM film LIMIT 100", (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  getFilmById(id, callback) {
    db.query("SELECT * FROM film WHERE film_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  getFilmById(id, callback) {
    db.query("SELECT * FROM film WHERE film_id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  createFilm(film, callback) {
    const { title, description, release_year, language_id } = film;
    db.query(
      "INSERT INTO film (title, description, release_year, language_id) VALUES (?, ?, ?, ?)",
      [title, description, release_year, language_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  }

  updateFilm(id, film, callback) {
    const { title, description, release_year } = film;
    db.query(
      "UPDATE film SET title = ?, description = ?, release_year = ? WHERE film_id = ?",
      [title, description, release_year, id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.affectedRows);
      }
    );
  }

  checkAvailability(filmId, callback) {
    const sql = `
    SELECT COUNT(*) AS available
    FROM inventory i
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
    WHERE i.film_id = ? AND r.rental_id IS NULL
  `;
    db.query(sql, [filmId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].available > 0); // true = beschikbaar
    });
  }

  listFilmsWithAvailability(callback) {
    const sql = `
    SELECT f.film_id, f.title, f.description, f.release_year,
      (SELECT COUNT(*) 
       FROM inventory i
       LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
       WHERE i.film_id = f.film_id AND r.rental_id IS NULL) AS available_count
    FROM film f
    ORDER BY f.title
  `;
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      // voeg een boolean available toe
      results.forEach((f) => (f.available = f.available_count > 0));
      callback(null, results);
    });
  }

  deleteFilm(id, callback) {
    db.query("DELETE FROM film WHERE film_id = ?", [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }

  getAllLanguages(callback) {
    const sql = "SELECT language_id, name FROM language ORDER BY name";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = new FilmDao();
