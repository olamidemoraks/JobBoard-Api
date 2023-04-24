const mongoose = require("mongoose");

const jobApplyScheme = new mongoose.Schema(
  {
    JId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    CId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    UId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Status: {
      type: String,
      enum: [
        "new applied",
        "screening",
        "interview",
        "offer",
        "decline",
        "hired",
      ],
      default: "new applied",
    },
    Notes: {
      type: String,
    },
    File: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ApplyJob", jobApplyScheme);
