const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const staffService = require("../services/staffService");

// LOGIN form
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", messages: {} });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  staffService.getByUsername(username, (err, user) => {
    if (err) return next(err);

    if (!user || !staffService.verifyPassword(password, user.password)) {
      return res.render("login", {
        title: "Login",
        messages: { error: ["Ongeldige gebruikersnaam of wachtwoord"] },
      });
    }

    req.session.user = {
      id: user.staff_id,
      name: user.first_name + " " + user.last_name,
      username: user.username,
    };

    res.redirect("/");
  });
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// REGISTER form
router.get("/register", (req, res, next) => {
  staffService.listStores((err, stores) => {
    if (err) return next(err);

    staffService.listAddresses((err, addresses) => {
      if (err) return next(err);

      res.render("register", {
        title: "Registreer",
        stores,
        addresses,
        error: null,
      });
    });
  });
});

// REGISTER submit
router.post("/register", (req, res, next) => {
  staffService.registerStaff(req.body, (err, id) => {
    if (err) {
      return res.render("register", {
        title: "Registreer",
        stores: [],
        addresses: [],
        error: err.message,
      });
    }

    res.redirect("/auth/login");
  });
});

module.exports = router;
