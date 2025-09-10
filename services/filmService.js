const filmRepo = require("../dao/filmDao");

class FilmService {
  listFilms(callback) {
    filmRepo.getAllFilms(callback);
  }

  getFilm(id, callback) {
    filmRepo.getFilmById(id, callback);
  }
}

module.exports = new FilmService();
