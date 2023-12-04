const express = require("express");
const dotenv = require("dotenv");

//Route files
const bootcamps = require("./routes/bootcamps");

//LOAD env Vars
dotenv.config({ path: "./config/config.env" });

const app = express();

const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};
app.use(logger);

//Mount routers

app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`server running  in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
