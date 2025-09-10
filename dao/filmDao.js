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
}

module.exports = new FilmDao();
