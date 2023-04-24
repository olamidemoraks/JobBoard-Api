const express = require("express");
const {
  createSave,
  getSaved,
  removeSaved,
} = require("../controllers/savedController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, getSaved)
  .post(authenticateUser, createSave);
router.route("/:id").delete(authenticateUser, removeSaved);

module.exports = router;
