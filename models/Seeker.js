const mongoose = require("mongoose");

const educationScheme = new mongoose.Schema({
  CollegeName: {
    type: String,
  },
  Level: {
    type: String,
  },

  EducationPeriod: {
    type: String,
  },
  Field: {
    type: String,
  },
  Country: {
    type: String,
  },
  City_State: {
    type: String,
  },
});

const workScheme = new mongoose.Schema({
  JobTitle: {
    type: String,
  },
  Company: {
    type: String,
  },
  WorkPeriod: {
    type: String,
  },
  Description: {
    type: String,
  },
  Country: {
    type: String,
  },
  City_State: {
    type: String,
  },
});

const seekerScheme = new mongoose.Schema(
  {
    Email: {
      type: String,
    },
    UId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    FName: {
      type: String,
      max: 300,
      required: [true, "Please provide a first name"],
    },
    LName: {
      type: String,
      required: [true, "Please provide a last name"],
      max: 300,
    },

    Headline: String,

    Country: {
      type: String,
    },

    Address: {
      type: String,
    },

    PCode: {
      type: String,
    },

    City_State: {
      type: String,
    },
    Mobileno: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    Gender: {
      type: String,
    },
    Skills: {
      type: [String],
    },

    Photo: {
      type: String,
    },
    //Education
    Education: [educationScheme],
    //job
    Work: [workScheme],

    Relocate: Boolean,

    Remote: Boolean,

    Website: String,

    JobTitle: String,

    JobType: [String],

    Visibility: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Seeker", seekerScheme);
