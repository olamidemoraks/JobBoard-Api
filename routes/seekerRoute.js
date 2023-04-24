const express = require("express");
const {
  createSeeker,
  updateSeeker,
  getSeeker,
  uploadProfileImage,
} = require("../controllers/seekerController");
const { authenticateUser } = require("../middleware/authentication");
const { profileUpload } = require("../utils/fileStorage");

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createSeeker)
  .get(authenticateUser, getSeeker);
router.route("/").patch(authenticateUser, updateSeeker);
router
  .route("/image-upload")
  .patch(profileUpload.single("picture"), authenticateUser, uploadProfileImage);

module.exports = router;
