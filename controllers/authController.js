const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const {
  createUserPayload,
  jwtToken,
  attachCookiesToResponse,
} = require("../utils/jwt");

const login = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password)
    throw new customError.BadRequestError("Please provide Email and Password");
  const user = await User.findOne({ Email });

  if (!user) {
    throw new customError.UnauthenticatedError("Invalid Credential");
  }
  const isPasswordMatch = await user.comparePassword(Password);
  if (!isPasswordMatch) {
    throw new customError.UnauthenticatedError("Invalid Credential");
  }
  const userPayload = createUserPayload(user);
  const token = jwtToken({ payload: userPayload });
  console.log(token);

  attachCookiesToResponse({ res, token });
  res.status(StatusCodes.ACCEPTED).json({ token });
};

const signUp = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    throw new customError.BadRequestError("Please provide Email and Password");
  }
  const emailAlreadyExist = await User.findOne({ Email });
  console.log("Email", emailAlreadyExist);
  if (emailAlreadyExist) {
    throw new customError.BadRequestError("Email is already in use");
  }
  console.log(Email, Password);
  const user = await User.create(req.body);
  const userPayload = createUserPayload(user);
  const token = jwtToken({ payload: userPayload });

  attachCookiesToResponse({ res, token });
  res.status(StatusCodes.ACCEPTED).json({ token });
};
// const signUpEmployer = async (req, res) => {
//   const { Email, Password } = req.body;
//   if (!Email || !Password) {
//     throw new customError.BadRequestError("Please provide Email and Password");
//   }
//   const emailAlreadyExist = await User.findOne({ Email });
//   console.log("Email", emailAlreadyExist);
//   if (emailAlreadyExist) {
//     throw new customError.BadRequestError("Email is already in use");
//   }
//   console.log(Email, Password);
//   const user = await User.create(req.body);
//   const userPayload = createUserPayload(user);
//   const token = jwtToken({ payload: userPayload });

//   attachCookiesToResponse({ res, token });
//   res.status(StatusCodes.ACCEPTED).json({ token });
// };

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  login,
  signUp,
  logout,
};
