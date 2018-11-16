require("dotenv").config({ path: __dirname + ".env" });
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
    database: "[[PROJECT_NAME]]-dev",
    ...databaseDefaults
  },
  test: {
    database: "[[PROJECT_NAME]]-test",
    ...databaseDefaults
  },
  production: {
    database: "[[PROJECT_NAME]]-production",
    ...databaseDefaults
  }
};

module.exports = config;
