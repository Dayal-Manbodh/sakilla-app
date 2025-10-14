const db = require("../db/connection");

class CustomerDao {
  getAll(callback) {
    const sql =
      "SELECT customer_id, first_name, last_name, email FROM customer LIMIT 50";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  getById(id, callback) {
    const customerSql = `
    SELECT 
      c.*, 
      s.store_id, 
      a.address, 
      ci.city, 
      co.country
    FROM customer c
    JOIN store s ON c.store_id = s.store_id
    JOIN address a ON c.address_id = a.address_id
    JOIN city ci ON a.city_id = ci.city_id
    JOIN country co ON ci.country_id = co.country_id
    WHERE c.customer_id = ?;
  `;

    const rentalsSql = `
    SELECT 
      r.rental_id,
      r.rental_date,
      r.return_date,
      f.title AS film_title
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film f ON i.film_id = f.film_id
    WHERE r.customer_id = ?
    ORDER BY r.rental_date DESC
    LIMIT 10;
  `;

    // Eerst klant ophalen
    db.query(customerSql, [id], (err, customerResult) => {
      if (err) return callback(err);
      if (customerResult.length === 0) return callback(null, null);

      const customer = customerResult[0];

      // Dan huurgeschiedenis ophalen
      db.query(rentalsSql, [id], (err, rentalResults) => {
        if (err) return callback(err);
        // Callback geeft een object terug met beide resultaten
        callback(null, { customer, rentals: rentalResults });
      });
    });
  }

  create(customer, callback) {
    const sql = `
      INSERT INTO customer (store_id, first_name, last_name, email, address_id, active) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        customer.store_id || 1,
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.address_id || 1,
        1,
      ],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  }

  update(id, customer, callback) {
    const sql =
      "UPDATE customer SET first_name = ?, last_name = ?, email = ? WHERE customer_id = ?";
    db.query(
      sql,
      [customer.first_name, customer.last_name, customer.email, id],
      callback
    );
  }

  delete(id, callback) {
    const sql = "DELETE FROM customer WHERE customer_id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = new CustomerDao();
