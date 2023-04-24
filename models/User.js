const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
//FName LName Email Password DOB Nationality Address City State Mobileno PinCode Gender

const userScheme = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: true,
      validate: [validateEmail, "Please fill a valid email address"],
    },
    Password: {
      type: String,
      required: [true, "Please provide a password"],
      min: 6,
    },
    Photo: {
      type: String,
    },
    AccountType: {
      type: String,
      enum: ["seeker", "employer"],
      default: "seeker",
    },
  },
  { timestamps: true }
);

userScheme.pre("save", async function () {
  if (!this.isModified("Password")) return;
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

userScheme.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.Password);
  return isMatch;
};

module.exports = mongoose.model("User", userScheme);
