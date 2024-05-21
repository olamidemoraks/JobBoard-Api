require("express-async-errors");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const NotFoundError = require("./middleware/not-found");
const ErrorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./config/connectDB");
const corOptions = require("./config/corOptions");
const seekerRouter = require("./routes/seekerRoute");
const authRouter = require("./routes/authRoute");
const companyRouter = require("./routes/companyRoute");
const jobRouter = require("./routes/jobsRoute");
const savedRouter = require("./routes/savedRoute");
const overviewRouter = require("./routes/overviewRoute");

const app = express();

app.use(morgan("common"));
app.use(xss());
app.use(bodyParser.json({ limit: "30mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors(corOptions));
app.use(
  "/company",
  express.static(path.join(__dirname, "public/assets/company"))
);
app.use(
  "/profile",
  express.static(path.join(__dirname, "public/assets/profile"))
);
app.use("/document", express.static(path.join(__dirname, "public/document")));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.get("/", (req, res) => {
  res.status(200).send("Up and running");
});
app.get("/api/v1/resume/:name", (req, res) => {
  const { name } = req.params;
  // const filename = path.basename(`/document/${name}`);
  res.download(`../server/public/document/${name}`);
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/seeker", seekerRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/saved", savedRouter);
app.use("/api/v1/overview", overviewRouter);

app.use(NotFoundError);
app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log("You are ready to go "));
  } catch (error) {
    console.log(error);
  }
};

start();
