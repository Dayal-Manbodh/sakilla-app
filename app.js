var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

// Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const filmsRouter = require("./routes/films");
const customersRouter = require("./routes/customers");
const rentalsRouter = require("./routes/rentals");
const authRouter = require("./routes/auth");

var app = express();
app.use(expressLayouts);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Logging & parsing
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/films", filmsRouter);
app.use("/customers", customersRouter);
app.use("/rentals", rentalsRouter);
app.use("/auth", authRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "Pagina niet gevonden"));
});

// Error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500;

  res.status(status);
  res.render("error", {
    title: `Fout ${status}`,
    message: err.message || "Er is een onbekende fout opgetreden",
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
