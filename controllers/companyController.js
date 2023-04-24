const Company = require("../models/Company");
const Seeker = require("../models/Seeker");
const Job = require("../models/Job");
const ApplyJob = require("../models/ApplyJob");
const customCode = require("../errors");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");

const createCompany = async (req, res) => {
  const { userId } = req.user;
  req.body.UId = userId;
  const companyAlreadyExist = await Company.findOne({ UId: userId });
  if (companyAlreadyExist)
    throw new customCode.BadRequestError(
      "You have already created a company profile"
    );
  const newCompany = await Company.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ newCompany });
};

const updateCompany = async (req, res) => {
  const { id: companyId } = req.params;
  const company = await Company.findById({ _id: companyId }).lean();
  const updatedCompany = await Company.findByIdAndUpdate(
    { _id: companyId },
    { ...req.body },
    { new: true }
  );

  console.log(company.Logo, updatedCompany.Logo);
  if (updatedCompany.Logo !== company.Logo) {
    const filename = getImage(company.Logo);
    const isDuplicatePhoto = await Company.findOne({
      Logo: company.Logo,
    }).lean();
    console.log("isDuplicate", isDuplicatePhoto);
    if (!isDuplicatePhoto) {
      deleteImage(filename);
    }
  }

  res.status(StatusCodes.OK).json({ updatedCompany });
};

const getCompany = async (req, res) => {
  const { userId } = req.user;
  if (!userId) throw new customError.UnauthenticatedError("Invalid user");
  const getsCompany = await Company.findOne({ UId: userId });
  res.status(StatusCodes.OK).json(getsCompany);
};
const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const getCompany = await Company.findById({ _id: id });
  res.status(StatusCodes.OK).json(getCompany);
};

const createJob = async (req, res) => {
  const { userId } = req.user;
  req.body.UId = userId;

  const company = await Company.findOne({ UId: userId });
  if (!company) {
    throw new customCode.NotFoundError("Not authorized to perform this action");
  }

  req.body.CId = company._id;
  req.body.CompanyName = company.CompanyName;

  const newJob = await Job.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({ newJob });
};

const getCompanyJobs = async (req, res) => {
  const { id: companyId } = req.params;

  const jobs = await Job.find({ CId: companyId });
  res.status(StatusCodes.OK).json(jobs);
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById({ _id: id });
  if (!job) {
    throw new customCode.NotFoundError(`Job with ${id} does not exist`);
  }
  res.status(StatusCodes.OK).json(job);
};

const editCompanyJob = async (req, res) => {
  const { j_id: jobId } = req.params;
  if (!jobId) {
    throw new customCode.BadRequestError("Something went wrong, try again!");
  }

  const updatejobs = await Job.findOneAndUpdate(
    { _id: jobId },
    { ...req.body },
    { new: true }
  );

  res.status(StatusCodes.OK).json(updatejobs);
};

const deleteCompanyJob = async (req, res) => {
  const { j_id: jobId } = req.params;
  if (!jobId) {
    throw new customCode.BadRequestError("Something went wrong, try again!");
  }
  const updatejobs = await Job.findByIdAndDelete({ _id: jobId });

  res.status(StatusCodes.OK).json({ msg: "Succesfully deleted" });
};

const getJobApplicants = async (req, res) => {
  const { JId, CId } = req.params;
  const applicants = await ApplyJob.find({ JId, CId });

  const applicantWithProfile = await Promise.all(
    applicants.map(async (applicant) => {
      const profile = await Seeker.findOne({ UId: applicant.UId });
      return {
        ...applicant._doc,
        profile,
      };
    })
  );
  console.log(applicantWithProfile);
  res.status(StatusCodes.OK).json(applicantWithProfile);
};

const getApplicant = async (req, res) => {
  const { id } = req.params;
  const applicant = await ApplyJob.findById({ _id: id });
  const profile = await Seeker.findOne({ UId: applicant.UId });

  res.status(StatusCodes.OK).json({ ...applicant._doc, profile });
};

const getAllCompanyApplication = async (req, res) => {
  const { id: CId } = req.params;
  const applicants = await ApplyJob.find({ CId }).sort("-createdAt");
  const applicantWithProfile = await Promise.all(
    applicants.map(async (applicant) => {
      const profile = await Seeker.findOne({ UId: applicant.UId });
      const job = await Job.findById({ _id: applicant.JId });
      return {
        ...applicant._doc,
        Name: profile?.FName + " " + profile?.LName,
        Title: job.Title,
        Photo: profile?.Photo,
      };
    })
  );

  console.log(applicantWithProfile);
  res.status(StatusCodes.OK).json(applicantWithProfile);
};

const getImage = (name) => {
  const filename = path.basename(`/assets/company/${name}`);
  return filename;
};
const deleteImage = (filename) => {
  fs.unlink(
    path.join(__dirname, `../public/assets/company/${filename}`),
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Delete Successfull");
    }
  );
};

module.exports = {
  getJob,
  createCompany,
  updateCompany,
  getCompany,
  createJob,
  getCompanyJobs,
  editCompanyJob,
  deleteCompanyJob,
  getCompanyById,
  getJobApplicants,
  getApplicant,
  getAllCompanyApplication,
};
