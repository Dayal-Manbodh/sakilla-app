const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const rentalController = require("../controllers/rentalController");

// READ
router.get("/", isLoggedIn, rentalController.list);

// CREATE
router.get("/new", rentalController.newForm);
router.post("/", rentalController.create);

// CLOSE (update)
router.post("/:id/close", rentalController.close);

module.exports = router;
