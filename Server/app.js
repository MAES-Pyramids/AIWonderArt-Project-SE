const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//-------------------------------------------//
const app = express();
//---------------middleware------------------//
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
//-----------------Routes--------------------//
app.get("/", async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello from AIWonderArt.io",
  });
});
// Invalid routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    message: "Invalid route, please check URL",
  });
});
//-------------------------------------------//
module.exports = app;
