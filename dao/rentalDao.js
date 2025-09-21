const db = require("../db/connection");

class RentalDao {
  // Haal alle rentals op
  // Haal alle rentals op
  getAllRentals(callback) {
    const sql = `
    SELECT r.rental_id, r.rental_date, r.return_date,
           f.title AS film_title,
           c.first_name, c.last_name
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film f ON i.film_id = f.film_id
    JOIN customer c ON r.customer_id = c.customer_id
    ORDER BY r.rental_date DESC
    LIMIT 100
  `;
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  // Haal een beschikbaar inventory_id voor een film
  getAvailableInventory(filmId, callback) {
    const sql = `
      SELECT i.inventory_id
      FROM inventory i
      LEFT JOIN rental r
        ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
      WHERE i.film_id = ? AND r.rental_id IS NULL
      LIMIT 1
    `;
    db.query(sql, [filmId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0)
        return callback(new Error("Geen beschikbaar inventory-item"));
      callback(null, results[0].inventory_id);
    });
  }

  // Maak een nieuwe rental
  createRental(inventoryId, customerId, callback) {
    const sql = `
      INSERT INTO rental (inventory_id, customer_id, rental_date, staff_id)
      VALUES (?, ?, NOW(), 1)
    `;
    db.query(sql, [inventoryId, customerId], (err, result) => {
      if (err) return callback(err);
      callback(null, result.insertId);
    });
  }

  // Sluit een rental (terugbrengen)
  closeRental(rentalId, callback) {
    const sql = `
      UPDATE rental SET return_date = NOW() WHERE rental_id = ?
    `;
    db.query(sql, [rentalId], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }
}

module.exports = new RentalDao();
