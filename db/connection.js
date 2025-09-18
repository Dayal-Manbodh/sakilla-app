const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST, // bv. db-mysql-ams3-46626-do-user-8155278-0.b.db.ondigitalocean.com
  port: process.env.DB_PORT, // 25060
  user: process.env.DB_USER, // 2219243
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database:", process.env.DB_NAME);
    connection.release(); // verbinding teruggeven aan de pool
  }
});

module.exports = pool;
