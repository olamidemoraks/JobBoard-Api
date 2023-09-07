const mongoose = require("mongoose");

const CompanyScheme = new mongoose.Schema({
  UId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Name: {
    required: [true, "please provide name"],
    type: String,
  },
  CompanyName: {
    required: [true, "please provide name of company"],
    type: String,
  },
  CompanyDesc: {
    type: String,
  },
  CompanySnippet: {
    type: String,
  },
  Location: {
    type: String,
  },
  Title: { type: String },

  Url: {
    type: String,
  },
  CompanySize: {
    type: String,
  },
  Status: {
    type: String,
  },
  Email: {
    type: String,
  },
  MobileNo: {
    type: String,
  },
  Logo: {
    type: String,
  },
});

module.exports = mongoose.model("Company", CompanyScheme);
