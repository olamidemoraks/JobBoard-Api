const mongoose = require("mongoose");

const savedSchema = new mongoose.Schema(
  {
    UId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    JId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Saved", savedSchema);
