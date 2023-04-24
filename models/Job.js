const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    CId: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    UId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Contact: {
      type: String,
    },
    Title: {
      type: String,
      required: [true, "Provide Job title"],
    },
    Description: {
      type: String,
    },
    CompanyName: {
      type: String,
      required: [true, "Provide Company Name"],
    },

    Location: {
      type: String,
      required: [true, "Provide Location"],
    },
    Address: {
      type: String,
    },
    EmploymentType: {
      type: String,
      required: [true, "Provide Job Type"],
    },

    Skills: {
      type: [String],
    },
    Experience: { type: Number },
    Deadline: {
      type: Date,
    },
    HireNumber: {
      type: String,
    },
    isRemote: {
      type: Boolean,
    },
    resume: {
      type: String,
    },
    Benefits: {
      type: [String],
    },
    PayMin: {
      type: Number,
    },
    PayMax: {
      type: Number,
    },

    Applicants: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "CAD", "NGN", "GBP", "AUD"],
    },
    frequency: {
      type: String,
      enum: ["mo", "yr", "wk", "day", "hr"],
    },
    // Experience: {
    //   type: [String],
    // },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
