const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const filmController = require("../controllers/filmController");

// CREATE
router.get("/new", filmController.newForm);
router.post("/", filmController.create);

// UPDATE
router.get("/:id/edit", filmController.editForm);
router.post("/:id", filmController.update);

// DELETE
router.post("/:id/delete", filmController.delete);

// READ
router.get("/", isLoggedIn, filmController.list);
router.get("/:id", filmController.detail);

module.exports = router;
