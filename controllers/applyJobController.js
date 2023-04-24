const ApplyJob = require("../models/ApplyJob");
const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");

const applyForJob = async (req, res) => {
  const { userId } = req.user;
  const { JId } = req.body;
  req.body.UId = userId;
  const job = await Job.findById({ _id: JId });
  const hasApplied = await ApplyJob.findOne({ UId: userId, JId });
  if (hasApplied) {
    throw new customError.BadRequestError(
      "Sorry you have already applied for this Job."
    );
  }
  job.Applicants = job.Applicants + 1;
  await job.save();
  const apply = await ApplyJob.create({ ...req.body });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "successful applied", success: true });
};

const userApplication = async (req, res) => {
  const { userId } = req.user;
  const applications = await ApplyJob.find({ UId: userId });
  if (!applications) {
    res.status(StatusCodes.OK).json([]);
  }
  res.status(StatusCodes.OK).json(applications);
};

const upadateApplicantStatus = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;
  const application = await ApplyJob.findById({ _id: id });
  if (!application) {
    throw new customError.NotFoundError("applicant not found");
  }
  application.Status = Status;
  await application.save();
  res.status(StatusCodes.OK).json(application);
};

module.exports = {
  applyForJob,
  userApplication,
  upadateApplicantStatus,
};
