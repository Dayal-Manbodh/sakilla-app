const db = require("../db/connection");

class StaffDao {
  getByUsername(username, callback) {
    const sql = "SELECT * FROM staff WHERE username = ?";
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  createStaff(staff, callback) {
    const {
      username,
      password,
      first_name,
      last_name,
      email,
      store_id,
      address_id,
    } = staff;
    const sql = `
      INSERT INTO staff (username, password, first_name, last_name, email, store_id, address_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [username, password, first_name, last_name, email, store_id, address_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  }

  listStores(callback) {
    db.query("SELECT store_id, manager_staff_id FROM store", callback);
  }

  listAddresses(callback) {
    db.query(
      "SELECT address_id, address, district, postal_code FROM address",
      callback
    );
  }
}

module.exports = new StaffDao();
