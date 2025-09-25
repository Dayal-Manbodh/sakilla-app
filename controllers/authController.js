// controllers/authController.js
const staffService = require("../services/staffService");

// LOGIN form
exports.loginForm = (req, res) => {
  res.render("login", { title: "Login", messages: {} });
};

// LOGIN submit
exports.login = (req, res, next) => {
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
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
    };

    res.redirect("/");
  });
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// REGISTER form
exports.registerForm = (req, res, next) => {
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
};

// REGISTER submit
exports.register = (req, res, next) => {
  staffService.registerStaff(req.body, (err, id) => {
    if (err) {
      return res.render("register", {
        title: "Registreer",
        stores: [], // optioneel: opnieuw ophalen via listStores/listAddresses
        addresses: [],
        error: err.message,
      });
    }

    res.redirect("/auth/login");
  });
};
