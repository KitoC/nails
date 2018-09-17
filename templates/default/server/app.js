// Required packages for operation of app
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { initializePassport } = require("./middleware/authentication");
const config = require("./_config");

// Create a .env file in the root to use environment variables, add this file to gitignore.
require("dotenv").config();

// Assign the top-level function "express()" to app variable to create an express application so that we can use it to setup the back-end server
const app = express();

// Initialize Passport auth for app.
app.use(initializePassport);

// Ensures the application uses a middleware function (body-parser) to parse any json data that is sent through a (req.body) request body
app.use(bodyParser.json());

// Middleware for enabling cross-origin resource sharing (allows resrources to be requested from a domain that is different to the one the back-end server is hosted on) between the front-end and back-end of this app
app.use(cors());

// Connects the app to a cloud based database (mLab) while in development mode or a local database if tests are being run
mongoose.connect(
  config.mongoURI[app.settings.env],
  err => {
    if (err) {
      console.log(
        `Error connecting to database ${config.mongoURI[app.settings.env]}`,
        err
      );
    } else {
      console.log(
        `Connected to database ${config.mongoURI[app.settings.env]}!`
      );
    }
  }
);

// Route assignments
routes.forEach(route => {
  app.use(route.endpoint, require(route.path));
  console.log(`${route.endpoint} endpoint connected.`);
});

// Assigns a port for the app to listen on.
app.listen(3001, () => console.log("\n\nApp listening on Port 3001."));

module.exports = app;
