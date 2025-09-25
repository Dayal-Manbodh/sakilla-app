const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const customerController = require("../controllers/customerController");

// CREATE
router.get("/new", customerController.newForm);
router.post("/", customerController.create);

// UPDATE
router.get("/:id/edit", customerController.editForm);
router.post("/:id", customerController.update);

// DELETE
router.post("/:id/delete", customerController.delete);

// READ
router.get("/", isLoggedIn, customerController.list);
router.get("/:id", customerController.detail);

module.exports = router;
