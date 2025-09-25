// controllers/customerController.js
const customerService = require("../services/customerService");

// READ all
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

// READ one
exports.detail = (req, res, next) => {
  customerService.getCustomer(req.params.id, (err, customer) => {
    if (err) return next(err);
    if (!customer) return res.status(404).send("Klant niet gevonden");
    res.render("customers/customer", {
      title: "Klant details",
      customer,
      layout: "layout",
    });
  });
};

// CREATE form - nieuwe klant
exports.newForm = (req, res, next) => {
  res.render("customers/customer_form", {
    title: "Nieuwe Klant",
    customer: null,
    layout: "layout",
  });
};

// CREATE submit
exports.create = (req, res, next) => {
  customerService.createCustomer(req.body, (err, id) => {
    if (err) return next(err);
    res.redirect("/customers/" + id);
  });
};

// UPDATE form
exports.editForm = (req, res, next) => {
  customerService.getCustomer(req.params.id, (err, customer) => {
    if (err) return next(err);
    if (!customer) return res.status(404).send("Klant niet gevonden");
    res.render("customers/customer_form", {
      title: "Klant Bewerken",
      customer,
      layout: "layout",
    });
  });
};

// UPDATE submit
exports.update = (req, res, next) => {
  customerService.updateCustomer(req.params.id, req.body, (err) => {
    if (err) return next(err);
    res.redirect("/customers/" + req.params.id);
  });
};

// DELETE
exports.delete = (req, res, next) => {
  customerService.deleteCustomer(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect("/customers");
  });
};
