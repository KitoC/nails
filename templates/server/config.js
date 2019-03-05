// uncomment the following line to make use of the .env file if neccessary.
// require("dotenv").config({ path: __dirname + ".env" });

const config = {};

// TODO: write informational comments here
const databaseDefaults = {
  //
  adaptor: "sqlite3",
  path: "/database/local-databases/"
  //   user: your db username here,
  //   password: your db password here
  //   port: your db port number here
  //   host: "localhost"
};

config.database = {
  development: {
    database: "new-template-dev",
    ...databaseDefaults
  },
  test: {
    database: "new-template-test",
    ...databaseDefaults
  },
  production: {
    database: "new-template-production",
    ...databaseDefaults
  }
};

module.exports = config;
