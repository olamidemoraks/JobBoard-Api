const Job = require("../models/Job");
const Seeker = require("../models/Seeker");
const customCode = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Applicants = require("../models/ApplyJob");

const overviews = async (req, res) => {
  const { id: CId } = req.params;
  const totalJobs = await Job.countDocuments({ CId });
  const firstFiveJob = await Job.find({ CId }).sort("-createdAt").limit(3);
  const totalCandidates = await Applicants.countDocuments({ CId });
  const recentCandidates = await Applicants.find({ CId })
    .sort("-createdAt")
    .limit(5);
  const applicantWithProfile = await Promise.all(
    recentCandidates.map(async (applicant) => {
      const profile = await Seeker.findOne({ UId: applicant.UId });
      const job = await Job.findById({ _id: applicant.JId });
      return {
        Title: job.Title,
        ...applicant._doc,
        profile,
      };
    })
  );

  const overview = {
    totalJobs,
    totalCandidates,
    firstFiveJob,
    applicantWithProfile,
  };
  console.log(CId);
  res.status(StatusCodes.OK).json({ ...overview });
};

module.exports = {
  overviews,
};
