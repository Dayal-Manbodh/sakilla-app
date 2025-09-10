const express = require("express");
const router = express.Router();
const filmService = require("../services/filmService");

router.get("/", (req, res, next) => {
  filmService.listFilms((err, films) => {
    if (err) return next(err);
    res.render("films", { title: "Films", films });
  });
});

router.get("/:id", (req, res, next) => {
  filmService.getFilm(req.params.id, (err, film) => {
    if (err) return next(err);
    if (!film) return res.status(404).send("Film not found");
    res.render("film", { title: film.title, film });
  });
});

module.exports = router;
