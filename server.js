const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");

//Route files
const bootcamps = require("./routes/bootcamps");

//LOAD env Vars
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(logger);

//Mount routers

app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`server running  in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
