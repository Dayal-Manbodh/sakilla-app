const filmDao = require("../dao/filmDao");

class FilmService {
  listFilms(callback) {
    filmDao.getAllFilms(callback);
  }

  getFilm(id, callback) {
    filmDao.getFilmById(id, callback);
  }

  getFilmDetails(filmId, callback) {
    filmDao.getFilmDetails(filmId, callback);
  }

  createFilm(film, callback) {
    filmDao.createFilm(film, callback);
  }

  updateFilm(id, film, callback) {
    filmDao.updateFilm(id, film, callback);
  }

  deleteFilm(filmId, callback) {
    filmDao.deleteFilm(filmId, callback);
  }

  checkAvailability(id, callback) {
    filmDao.checkAvailability(id, callback);
  }

  listFilmsWithAvailability(callback) {
    filmDao.listFilmsWithAvailability(callback);
  }

  getAvailableFilms(callback) {
    filmDao.getAvailableFilms(callback);
  }

  getLanguages(callback) {
    filmDao.getAllLanguages(callback);
  }
}

module.exports = new FilmService();
