const express = require("express");
const {
  createCompany,
  getCompany,
  updateCompany,
  createJob,
  getCompanyJobs,
  editCompanyJob,
  getJob,
  deleteCompanyJob,
  getCompanyById,
  getJobApplicants,
  getApplicant,
  getAllCompanyApplication,
} = require("../controllers/companyController");
const { upadateApplicantStatus } = require("../controllers/applyJobController");
const { authenticateUser } = require("../middleware/authentication");
const { companyUpload } = require("../utils/fileStorage");

const router = express.Router();

router
  .route("/")
  .post(companyUpload.single("picture"), authenticateUser, createCompany)
  .get(authenticateUser, getCompany);

router
  .route("/:id")
  .get(authenticateUser, getCompanyById)
  .patch(companyUpload.single("picture"), authenticateUser, updateCompany);
router.route("/allcompany/:id").get(getCompanyById);
router.route("/jobs").post(authenticateUser, createJob);
router.route("/jobs/:id").get(authenticateUser, getCompanyJobs);
router.route("/jobs/getjob/:id").get(authenticateUser, getJob);
router
  .route("/jobs/:j_id")
  .patch(authenticateUser, editCompanyJob)
  .delete(authenticateUser, deleteCompanyJob);
router.route("/applicant/:JId/:CId").get(authenticateUser, getJobApplicants);
router.route("/getApplicant/:id").get(authenticateUser, getApplicant);
router
  .route("/application/:id")
  .get(authenticateUser, getAllCompanyApplication);
router.route("/applicant/:id").patch(authenticateUser, upadateApplicantStatus);
module.exports = router;
