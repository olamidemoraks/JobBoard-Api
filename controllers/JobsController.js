const Job = require("../models/Job");
const Company = require("../models/Company");
const ApiQuota = require("../models/ApiQuota");
const customCode = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { getFeatureJob, getFeatureJobs } = require("../utils/featureApiQuery");
const { convertFeatureJobData, converter } = require("../utils/featureJobData");
const mongoose = require("mongoose");

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
    page,
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

  const pageNo = Number(page) || 1;
  const limit = 8;
  const skip = (pageNo - 1) * limit;

  const jobs = await query.limit(limit).skip(skip);

  const jobWithCompany = await Promise.all(
    jobs.map(async (job) => {
      const company = await Company.find({ _id: job.CId });
      return {
        ...job._doc,
        CompanySize: company[0].CompanySize,
        Logo: company[0].Logo,
        CompanyDesc: company[0].CompanyDesc,
        isFeatured: false,
      };
    })
  );

  // for Rapid api Jsearch job
  // switch between our rapid api account when a quota has been exhusted
  console.log({ value: await ApiQuota.count() });
  if ((await ApiQuota.count()) === 0) {
    await ApiQuota.create({ quotaType: 1 });
  }

  const allQuota = await ApiQuota.find({});
  const quota = allQuota?.[0];
  let quotaType = quota.quotaType;

  console.log({ quota });
  let featureJob;

  featureJob = await getFeatureJobs({
    remote_jobs_only: isRemote ? isRemote : false,
    query: Title ? Title : "developer",
    type: quotaType,
    page: page,
  });

  if (featureJob.length < 1) {
    for (i = 0; i < 4; i++) {
      quotaType++;
      if (quotaType === 4) {
        quotaType = 1;
      }

      featureJob = await getFeatureJobs({
        remote_jobs_only: isRemote ? isRemote : false,
        query: Title ? Title : "developer",
        type: quotaType,
        page: page,
      });

      if (featureJob.length > 1) {
        await ApiQuota.findByIdAndUpdate(quota._id, { quotaType });
        break;
      }
    }
  }

  const featureJobConvert = await convertFeatureJobData(featureJob);

  res.status(StatusCodes.OK).json([...jobWithCompany, ...featureJobConvert]);
};

const getJob = async (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const job = await Job.findById({ _id: id });
    if (!job) {
      throw new customCode.NotFoundError(`Job with ${id} does not exist`);
    }
    res.status(StatusCodes.OK).json(job);
  } else {
    const allQuota = await ApiQuota.find({});
    const quota = allQuota?.[0];
    let quotaType = quota.quotaType;
    const featureJob = await getFeatureJob({ id, type: quotaType });
    const job = await convertFeatureJobData(featureJob);
    if (!job[0]) {
      throw new customCode.NotFoundError(`Job with ${id} does not exist`);
    }
    res.status(StatusCodes.OK).json({ ...job?.[0] });
  }
};

module.exports = {
  getJobs,
  getJob,
};
