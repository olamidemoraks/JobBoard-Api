const { decode } = require("jsonwebtoken");
const customError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = (req, res, next) => {
  try {
    let token;
    // token = req.signedCookies.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      console.log("header", authHeader);
      if (!authHeader && authHeader.startsWith("Bearer")) {
        throw new customError.UnauthenticatedError("Authentication Invalid");
      }
      token = authHeader.split(" ")[1];
    }
    if (!token)
      throw new customError.UnauthenticatedError("Authentication Error");
    const isCustomAuth = token.length < 500;
    if (isCustomAuth) {
      const { userId, email } = isTokenValid({ token });
      req.user = { userId, email };
    } else {
      const { sub, email } = decode(token);
      req.user = { userId: sub, email };
    }

    next();
  } catch (error) {
    throw new customError.UnauthenticatedError("Authentication Error");
  }
};

module.exports = { authenticateUser };
