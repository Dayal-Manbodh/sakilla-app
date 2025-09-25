// controllers/rentalController.js
const rentalService = require("../services/rentalService");
const filmService = require("../services/filmService");
const customerService = require("../services/customerService");

// Lijst alle rentals
exports.list = (req, res, next) => {
  rentalService.listRentals((err, rentals) => {
    if (err) return next(err);
    res.render("rentals/rentals", {
      title: "Verhuurtransacties",
      rentals,
      layout: "layout",
    });
  });
};

// Nieuwe rental form
exports.newForm = (req, res, next) => {
  filmService.listFilmsWithAvailability((err, films) => {
    if (err) return next(err);
    customerService.listCustomers((err, customers) => {
      if (err) return next(err);
      res.render("rentals/rental_form", {
        title: "Nieuwe Verhuur",
        films,
        customers,
        layout: "layout",
      });
    });
  });
};

// Nieuwe rental opslaan
exports.create = (req, res, next) => {
  const { film_id, customer_id } = req.body;
  rentalService.createRental(film_id, customer_id, (err, id) => {
    if (err) return next(err);
    res.redirect("/rentals");
  });
};

// Rental terugbrengen (sluiten)
exports.close = (req, res, next) => {
  rentalService.closeRental(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect("/rentals");
  });
};
