const express = require("express");
const { login, signUp, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.get("/logout", logout);

module.exports = router;
