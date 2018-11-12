// Required packages for operation of app
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { mongoURI, theme } = require("./config/_server-config");

// Create a .env file in the root to use environment variables, add this file to gitignore.
require("dotenv").config();

// Assign the top-level function "express()" to app variable to create an express application so that we can use it to setup the back-end server
const app = express();

// TODO: Figure out how to handle authentication with user input.
// const { initializePassport } = require("./middleware/authentication");
// app.use(initializePassport);

// Ensures the application uses a middleware function (body-parser) to parse any json data that is sent through a (req.body) request body
app.use(bodyParser.json());

// Middleware for enabling cross-origin resource sharing (allows resrources to be requested from a domain that is different to the one the back-end server is hosted on) between the front-end and back-end of this app
app.use(cors());

// Connects the app to a cloud based database (mLab) while in development mode or a local database if tests are being run
mongoose.connect(
  mongoURI[app.settings.env],
  err => {
    if (err) {
      console.log(
        `Error connecting to database ${mongoURI[app.settings.env]}`,
        err
      );
    } else {
      console.log(`Connected to database ${mongoURI[app.settings.env]}!`);
    }
  }
);

// Route assignments
// console.log("\n");
routes.forEach(route => {
  app.use(route);
});
console.log(theme.success(`all routes connected.`));

// Assigns a port for the app to listen on.
app.listen(3001, () => console.log("\n\nApp listening on Port 3001."));

module.exports = app;
