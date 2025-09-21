// Controleer of een gebruiker ingelogd is
function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    // Render de login pagina met foutmelding
    return res.render("login", {
      title: "Login",
      messages: { error: ["Je moet ingelogd zijn"] },
    });
  }
  next();
}

module.exports = { isLoggedIn };
