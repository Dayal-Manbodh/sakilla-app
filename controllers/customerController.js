// controllers/customerController.js
const customerService = require("../services/customerService");

// ✅ ALLE KLANTEN
exports.list = (req, res, next) => {
  customerService.listCustomers((err, customers) => {
    if (err) return next(err);
    res.render("customers/customers", {
      title: "Klanten",
      customers,
      layout: "layout",
    });
  });
};

// ✅ KLANTDETAILS (inclusief huurgeschiedenis)
exports.detail = (req, res, next) => {
  const id = req.params.id;

  customerService.getCustomer(id, (err, data) => {
    if (err) return next(err);
    if (!data) return res.status(404).send("Klant niet gevonden");

    res.render("customers/customer", {
      title: "Klantdetails",
      customer: data.customer, // klantinfo
      rentals: data.rentals || [], // huurgeschiedenis
      layout: "layout",
    });
  });
};

// ✅ FORMULIER VOOR NIEUWE KLANT
exports.newForm = (req, res) => {
  res.render("customers/customer_form", {
    title: "Nieuwe Klant",
    customer: null,
    layout: "layout",
  });
};

// ✅ NIEUWE KLANT OPSLAAN
exports.create = (req, res, next) => {
  customerService.createCustomer(req.body, (err, id) => {
    if (err) return next(err);
    res.redirect(`/customers/${id}`);
  });
};

// ✅ FORMULIER VOOR BEWERKEN
exports.editForm = (req, res, next) => {
  const id = req.params.id;

  customerService.getCustomer(id, (err, data) => {
    if (err) return next(err);
    if (!data) return res.status(404).send("Klant niet gevonden");

    res.render("customers/customer_form", {
      title: "Klant Bewerken",
      customer: data.customer, // enkel klantinfo
      layout: "layout",
    });
  });
};

// ✅ BEWERKING OPSLAAN
exports.update = (req, res, next) => {
  const id = req.params.id;

  customerService.updateCustomer(id, req.body, (err) => {
    if (err) return next(err);
    res.redirect(`/customers/${id}`);
  });
};

// ✅ KLANT VERWIJDEREN
exports.delete = (req, res, next) => {
  const id = req.params.id;

  customerService.deleteCustomer(id, (err) => {
    if (err) return next(err);
    res.redirect("/customers");
  });
};
