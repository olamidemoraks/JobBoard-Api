const Seeker = require("../models/Seeker");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const path = require("path");
const fs = require("fs");

const createSeeker = async (req, res) => {
  const { userId } = req.user;
  req.body.UId = userId;
  const seekerExist = await Seeker.findOne({ UId: userId });
  if (seekerExist) {
    throw new customError.BadRequestError("User already has a profile");
  }
  console.log(req.body);
  const newSeeker = await Seeker.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ newSeeker });
};

const updateSeeker = async (req, res) => {
  const { userId } = req.user;
  if (!userId) throw new customError.UnauthenticatedError("Invalid user");
  // if (!seekerId) throw new customError.NotFoundError("Invalid user");
  console.log(req.body);
  const updatedSeeker = await Seeker.findOneAndUpdate(
    { UId: userId },
    { ...req.body },
    { new: true }
  );

  console.log(updateSeeker);
  res.status(StatusCodes.OK).json({ updatedSeeker });
};

const getSeeker = async (req, res) => {
  const { userId } = req.user;
  if (!userId) throw new customError.UnauthenticatedError("Invalid user");
  const getsSeeker = await Seeker.findOne({ UId: userId });

  res.status(StatusCodes.OK).json(getsSeeker);
};

const uploadProfileImage = async (req, res) => {
  const { userId } = req.user;
  const { Photo } = req.body;
  const user = await User.findById(userId);
  const profile = await Seeker.findOne({ UId: userId });

  const oldPhoto = profile.Photo;

  user.Photo = Photo;
  profile.Photo = Photo;
  await user.save();
  await profile.save();
  if (profile.Photo !== oldPhoto) {
    const filename = getImage(oldPhoto);
    const isDuplicatePhoto = await Seeker.findOne({ Photo: oldPhoto });
    if (!isDuplicatePhoto) {
      deleteImage(filename);
    }
  }

  res.status(StatusCodes.OK).json({ msg: "Upload was successfull" });
};

const getImage = (name) => {
  const filename = path.basename(`/assets/profile/${name}`);
  return filename;
};
const deleteImage = (filename) => {
  fs.unlink(
    path.join(__dirname, `../public/assets/profile/${filename}`),
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Delete Successfull");
    }
  );
};
module.exports = {
  createSeeker,
  updateSeeker,
  getSeeker,
  uploadProfileImage,
};
