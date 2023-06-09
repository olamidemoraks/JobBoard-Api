const Job = require("../models/Job");
const Company = require("../models/Company");
const customCode = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getJobs = async (req, res) => {
  const {
    isRemote,
    PayMax,
    PayMin,
    Title,
    Experience,
    EmploymentType,
    Skills,
    Address,
  } = req.query;
  let queryObj = {};
  if (isRemote) {
    queryObj.isRemote = "true" ? true : false;
  }
  if (Title) {
    queryObj.Title = { $regex: Title, $options: "i" };
  }

  if (PayMax) {
    queryObj.PayMax = PayMax;
  }
  if (PayMin) {
    queryObj.PayMin = PayMin;
  }
  if (Experience) {
    if (Experience.gte !== "" || Experience.lte !== "") {
      queryObj.Experience = Experience;
    }
  }
  if (EmploymentType) {
    type = EmploymentType.split(" ");
    queryObj.EmploymentType = type;
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  queryObj = JSON.parse(queryStr);

  if (Skills) {
    skills = Skills.split(" ");

    //to make the skill value case insensitive
    var skillArray = skills.map((skill) => {
      return new RegExp(skill, "i");
    });
    queryObj.Skills = { $in: skillArray };
  }
  const query = Job.find({
    isActive: true,
    $or: [
      { Location: { $regex: Address, $options: "i" } },
      { Address: { $regex: Address, $options: "i" } },
    ],
    ...queryObj,
  });

  const jobs = await query;

  const jobWithCompany = await Promise.all(
    jobs.map(async (job) => {
      const company = await Company.find({ _id: job.CId });
      return {
        ...job._doc,
        CompanySize: company[0].CompanySize,
        Logo: company[0].Logo,
        CompanyDesc: company[0].CompanyDesc,
      };
    })
  );
  res.status(StatusCodes.OK).json(jobWithCompany);
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById({ _id: id });
  if (!job) {
    throw new customCode.NotFoundError(`Job with ${id} does not exist`);
  }

  res.status(StatusCodes.OK).json(job);
};

module.exports = {
  getJobs,
  getJob,
};
