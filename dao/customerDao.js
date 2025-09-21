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
    const sql = "SELECT * FROM customer WHERE customer_id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
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
