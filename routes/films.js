const express = require("express");
const router = express.Router();
const filmService = require("../services/filmService");
const { isLoggedIn } = require("../middleware/auth");

// CREATE form - Nieuwe Film
router.get("/new", (req, res, next) => {
  filmService.getLanguages((err, languages) => {
    if (err) return next(err);
    res.render("films/film_form", {
      title: "Nieuwe Film",
      film: null,
      languages,
      layout: "layout",
    });
  });
});

// CREATE submit - Nieuwe Film opslaan
router.post("/", (req, res, next) => {
  filmService.createFilm(req.body, (err, id) => {
    if (err) return next(err);
    res.redirect("/films/" + id);
  });
});

// UPDATE form - Film Bewerken
router.get("/:id/edit", (req, res, next) => {
  filmService.getFilm(req.params.id, (err, film) => {
    if (err) return next(err);
    if (!film) return res.status(404).send("Film not found");

    filmService.getLanguages((err, languages) => {
      if (err) return next(err);
      res.render("films/film_form", {
        title: "Film Bewerken",
        film,
        languages,
        layout: "layout",
      });
    });
  });
});

// UPDATE submit - Film opslaan
router.post("/:id", (req, res, next) => {
  filmService.updateFilm(req.params.id, req.body, (err) => {
    if (err) return next(err);
    res.redirect("/films/" + req.params.id);
  });
});

// DELETE film
router.post("/:id/delete", (req, res, next) => {
  const filmId = req.params.id;

  filmService.deleteFilm(filmId, (err) => {
    if (err) {
      // optioneel: log de fout voor debugging
      console.error("Fout bij verwijderen film:", err.message);
      return next(err);
    }
    res.redirect("/films");
  });
});
// READ all films (lijst)
router.get("/", isLoggedIn, (req, res, next) => {
  const searchQuery = req.query.q || "";
  filmService.listFilmsWithAvailability((err, films) => {
    if (err) return next(err);

    // filter op beschikbaarheid
    let filteredFilms = films;
    if (req.query.available === "true") {
      filteredFilms = filteredFilms.filter((f) => f.available);
    }

    // filter op zoekterm
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredFilms = filteredFilms.filter((f) =>
        f.title.toLowerCase().includes(q)
      );
    }

    res.render("films/films", {
      title: "Films",
      films: filteredFilms,
      layout: "layout",
      filterAvailable: req.query.available === "true",
      searchQuery,
    });
  });
});

// READ one film (detailpagina)
router.get("/:id", (req, res, next) => {
  filmService.getFilm(req.params.id, (err, film) => {
    if (err) return next(err);
    if (!film) return res.status(404).send("Film not found");

    // beschikbaarheid check
    filmService.checkAvailability(req.params.id, (err, available) => {
      if (err) return next(err);
      res.render("films/film", {
        title: film.title,
        film,
        available,
        layout: "layout",
      });
    });
  });
});

module.exports = router;
