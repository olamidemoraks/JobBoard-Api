const express = require("express");
const router = express.Router();
const { overviews } = require("../controllers/overiewController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/:id").get(authenticateUser, overviews);

module.exports = router;
