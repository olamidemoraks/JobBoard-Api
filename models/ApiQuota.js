const mongoose = require("mongoose");
const QuotaSchema = new mongoose.Schema({
  quotaType: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Quota", QuotaSchema);
