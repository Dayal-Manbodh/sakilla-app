const express = require("express");
const router = express.Router();
const rentalService = require("../services/rentalService");
const filmService = require("../services/filmService");
const customerService = require("../services/customerService");
const { isLoggedIn } = require("../middleware/auth");

// Lijst alle rentals
router.get("/", isLoggedIn, (req, res, next) => {
  rentalService.listRentals((err, rentals) => {
    if (err) return next(err);
    res.render("rentals/rentals", {
      title: "Verhuurtransacties",
      rentals,
      layout: "layout",
    });
  });
});

// Nieuwe rental form
router.get("/new", (req, res, next) => {
  // haal alle films en klanten op
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
});

// Nieuwe rental opslaan
router.post("/", (req, res, next) => {
  const { film_id, customer_id } = req.body;
  rentalService.createRental(film_id, customer_id, (err, id) => {
    if (err) return next(err);
    res.redirect("/rentals");
  });
});

// Rental terugbrengen
router.post("/:id/close", (req, res, next) => {
  rentalService.closeRental(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect("/rentals");
  });
});

module.exports = router;
