const multer = require("multer");

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/profile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const companyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/company");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/document");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const companyUpload = multer({ storage: companyStorage });
const profileUpload = multer({ storage: profileStorage });
const resumeUpload = multer({ storage: resumeStorage });
module.exports = { resumeUpload, companyUpload, profileUpload };
