const Company = require("../models/Company");
const Job = require("../models/Job");
const Saved = require("../models/Saved");
const customCode = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createSave = async (req, res) => {
  const { userId } = req.user;
  const { JId } = req.body;
  req.body.UId = userId;
  const findJob = await Job.findById({ _id: JId });
  if (!findJob) {
    throw new customCode.NotFoundError("Job was not found to be saved");
  }
  const findJobInSaved = await Saved.findOne({ JId, UId: userId });
  if (!findJobInSaved) {
    const createSave = await Saved.create({ ...req.body });
    res.status(StatusCodes.CREATED).json(createSave);
  }

  await findJobInSaved.deleteOne();
  await findJobInSaved.save();
  res.status(StatusCodes.OK).json("removed from saved");
};

const getSaved = async (req, res) => {
  const { userId } = req.user;
  const saved = await Saved.find({ UId: userId });

  const savedJob = await Promise.all(
    saved.map(async (save) => {
      const jobs = await Job.find({ _id: save.JId });

      return {
        ...jobs[0]._doc,
        saveId: save._id,
      };
    })
  );
  const jobWithCompany = await Promise.all(
    savedJob.map(async (job) => {
      const company = await Company.find({ _id: job.CId });
      return {
        ...job,
        CompanySize: company[0].CompanySize,
        Logo: company[0].Logo,
        CompanyDesc: company[0].CompanyDesc,
      };
    })
  );

  res.status(StatusCodes.OK).json(jobWithCompany);
};

const removeSaved = async (req, res) => {
  const { id } = req.params;
  await Saved.findByIdAndDelete({ _id: id });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Saved has been deleted successfuly" });
};

module.exports = {
  getSaved,
  createSave,
  removeSaved,
};
