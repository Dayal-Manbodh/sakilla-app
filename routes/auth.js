const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// LOGIN
router.get("/login", authController.loginForm);
router.post("/login", authController.login);

// LOGOUT
router.get("/logout", authController.logout);

// REGISTER
router.get("/register", authController.registerForm);
router.post("/register", authController.register);

module.exports = router;
