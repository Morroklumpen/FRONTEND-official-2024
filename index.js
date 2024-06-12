// global modules
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
var cookieParser = require("cookie-parser");

// local modules
const defaultRoutes = require("./routes/defaultRoutes");

// init
const app = express();
const PORT = process.env.PORT || 3000;
// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(defaultRoutes);

app.listen(PORT, startup);

async function startup() {
  console.info("server runnung @ ", PORT);
}
