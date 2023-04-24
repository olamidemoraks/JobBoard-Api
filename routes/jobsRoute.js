const express = require("express");
const { getJob, getJobs } = require("../controllers/JobsController");
const {
  applyForJob,
  userApplication,
} = require("../controllers/applyJobController");
const { resumeUpload } = require("../utils/fileStorage");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.route("/").get(getJobs);
router.route("/:id").get(getJob);
router
  .route("/apply")
  .post(resumeUpload.single("resume"), authenticateUser, applyForJob);
router.route("/apply/user-application").get(authenticateUser, userApplication);
module.exports = router;
