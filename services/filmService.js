const filmDao = require("../dao/filmDao");

class FilmService {
  listFilms(callback) {
    filmDao.getAllFilms(callback);
  }

  getFilm(id, callback) {
    filmDao.getFilmById(id, callback);
  }

  createFilm(film, callback) {
    filmDao.createFilm(film, callback);
  }

  updateFilm(id, film, callback) {
    filmDao.updateFilm(id, film, callback);
  }

  deleteFilm(id, callback) {
    filmDao.deleteFilm(id, callback);
  }

  checkAvailability(filmId, callback) {
    filmDao.checkAvailability(filmId, callback);
  }

  listFilmsWithAvailability(callback) {
    filmDao.listFilmsWithAvailability(callback);
  }

  listLanguages(callback) {
    filmDao.getAllLanguages(callback);
  }
}

module.exports = new FilmService();
