const mongoose = require("mongoose");
const connectDB = (uri) => {
  return mongoose.connect(uri, { family: 4 });
};

module.exports = connectDB;
