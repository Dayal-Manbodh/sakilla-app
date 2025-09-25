const filmService = require("../services/filmService");

// CREATE form
exports.newForm = (req, res, next) => {
  filmService.getLanguages((err, languages) => {
    if (err) return next(err);
    res.render("films/film_form", {
      title: "Nieuwe Film",
      film: null,
      languages,
      layout: "layout",
    });
  });
};

// CREATE submit
exports.create = (req, res, next) => {
  filmService.createFilm(req.body, (err, id) => {
    if (err) return next(err);
    res.redirect("/films/" + id);
  });
};

// UPDATE form
exports.editForm = (req, res, next) => {
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
};

// UPDATE submit
exports.update = (req, res, next) => {
  filmService.updateFilm(req.params.id, req.body, (err) => {
    if (err) return next(err);
    res.redirect("/films/" + req.params.id);
  });
};

// DELETE
exports.delete = (req, res, next) => {
  filmService.deleteFilm(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect("/films");
  });
};

// READ all
exports.list = (req, res, next) => {
  const searchQuery = req.query.q || "";

  filmService.listFilmsWithAvailability((err, films) => {
    if (err) return next(err);

    let filtered = films;
    if (req.query.available === "true") {
      filtered = filtered.filter((f) => f.available);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((f) => f.title.toLowerCase().includes(q));
    }

    res.render("films/films", {
      title: "Films",
      films: filtered,
      layout: "layout",
      filterAvailable: req.query.available === "true",
      searchQuery,
    });
  });
};

// READ one
exports.detail = (req, res, next) => {
  const filmId = req.params.id;

  filmService.getFilmDetails(filmId, (err, data) => {
    if (err) return next(err);
    if (!data || !data.film) return res.status(404).send("Film not found");

    res.render("films/film", {
      title: data.film.title,
      film: data.film,
      actors: data.actors,
      categories: data.categories,
      stores: data.stores,
      layout: "layout",
    });
  });
};
