const jwt = require("jsonwebtoken");

const jwtToken = ({ payload }) => {
  return (token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  }));
};

const createUserPayload = (user) => {
  return { email: user.Email, userId: user._id };
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

// const createToken = ({ payload }) => {
//   const token = jwtToken({ payload });
//   return token;
// };

const attachCookiesToResponse = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 48;

  res.cookie("token", token, {
    httpOnly: true,
    expire: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
module.exports = {
  jwtToken,
  createUserPayload,
  isTokenValid,
  attachCookiesToResponse,
};
