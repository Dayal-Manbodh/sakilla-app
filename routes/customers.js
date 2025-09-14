const express = require("express");
const router = express.Router();
const customerService = require("../services/customerService");

// READ all
router.get("/", (req, res, next) => {
  customerService.listCustomers((err, customers) => {
    if (err) return next(err);
    res.render("customers/customers", {
      title: "Klanten",
      customers,
      layout: "layout",
    });
  });
});

// READ one
router.get("/:id", (req, res, next) => {
  customerService.getCustomer(req.params.id, (err, customer) => {
    if (err) return next(err);
    if (!customer) return res.status(404).send("Klant niet gevonden");
    res.render("customers/customer", {
      title: "Klant details",
      customer,
      layout: "layout",
    });
  });
});

// CREATE form
router.get("/new", (req, res) => {
  res.render("customers/customer_form", {
    title: "Nieuwe Klant",
    layout: "layout",
  });
});

// CREATE submit
router.post("/", (req, res, next) => {
  customerService.createCustomer(req.body, (err, id) => {
    if (err) return next(err);
    res.redirect("/customers/" + id);
  });
});

// UPDATE form
router.get("/:id/edit", (req, res, next) => {
  customerService.getCustomer(req.params.id, (err, customer) => {
    if (err) return next(err);
    if (!customer) return res.status(404).send("Klant niet gevonden");
    res.render("customers/customer_form", {
      title: "Klant Bewerken",
      customer,
      layout: "layout",
    });
  });
});

// UPDATE submit
router.post("/:id", (req, res, next) => {
  customerService.updateCustomer(req.params.id, req.body, (err) => {
    if (err) return next(err);
    res.redirect("/customers/" + req.params.id);
  });
});

// DELETE
router.post("/:id/delete", (req, res, next) => {
  customerService.deleteCustomer(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect("/customers");
  });
});

module.exports = router;
