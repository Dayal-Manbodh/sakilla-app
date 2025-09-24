const express = require("express");
const router = express.Router();
const filmService = require("../services/filmService");
const { isLoggedIn } = require("../middleware/auth");

// CREATE form - Nieuwe Film
router.get("/new", (req, res, next) => {
  console.log("[GET] /films/new - formulier voor nieuwe film");
  filmService.getLanguages((err, languages) => {
    if (err) {
      console.error("Fout bij ophalen talen:", err);
      return next(err);
    }
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
  console.log("[POST] /films - nieuwe film opslaan:", req.body);
  filmService.createFilm(req.body, (err, id) => {
    if (err) {
      console.error("Fout bij opslaan nieuwe film:", err);
      return next(err);
    }
    console.log("Nieuwe film aangemaakt met id:", id);
    res.redirect("/films/" + id);
  });
});

// UPDATE form - Film Bewerken
router.get("/:id/edit", (req, res, next) => {
  console.log(`[GET] /films/${req.params.id}/edit - formulier bewerken`);
  filmService.getFilm(req.params.id, (err, film) => {
    if (err) {
      console.error("Fout bij ophalen film:", err);
      return next(err);
    }
    if (!film) {
      console.warn("Film niet gevonden:", req.params.id);
      return res.status(404).send("Film not found");
    }

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
  console.log(`[POST] /films/${req.params.id} - film bijwerken`, req.body);
  filmService.updateFilm(req.params.id, req.body, (err) => {
    if (err) {
      console.error("Fout bij updaten film:", err);
      return next(err);
    }
    console.log("Film succesvol bijgewerkt:", req.params.id);
    res.redirect("/films/" + req.params.id);
  });
});

// DELETE film
router.post("/:id/delete", (req, res, next) => {
  const filmId = req.params.id;
  console.log(`[POST] /films/${filmId}/delete - film verwijderen`);

  filmService.deleteFilm(filmId, (err) => {
    if (err) {
      console.error("Fout bij verwijderen film:", err.message);
      return next(err);
    }
    console.log("Film succesvol verwijderd:", filmId);
    res.redirect("/films");
  });
});

// READ all films (lijst)
router.get("/", isLoggedIn, (req, res, next) => {
  console.log("[GET] /films - lijst films ophalen", req.query);

  const searchQuery = req.query.q || "";
  filmService.listFilmsWithAvailability((err, films) => {
    if (err) {
      console.error("Fout bij ophalen films:", err);
      return next(err);
    }

    let filteredFilms = films;
    if (req.query.available === "true") {
      filteredFilms = filteredFilms.filter((f) => f.available);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredFilms = filteredFilms.filter((f) =>
        f.title.toLowerCase().includes(q)
      );
    }

    console.log(`Aantal films gevonden: ${filteredFilms.length}`);
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
  console.log(`[GET] /films/${req.params.id} - detailpagina ophalen`);

  filmService.getFilm(req.params.id, (err, film) => {
    if (err) {
      console.error("Fout bij ophalen film:", err);
      return next(err);
    }
    if (!film) {
      console.warn("Film niet gevonden:", req.params.id);
      return res.status(404).send("Film not found");
    }

    filmService.checkAvailability(req.params.id, (err, available) => {
      if (err) {
        console.error("Fout bij beschikbaarheidscheck:", err);
        return next(err);
      }
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
