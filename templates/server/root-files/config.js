const adaptorType = adaptor => {
  switch (adaptor) {
    default:
      return `
    //
    adaptor: "sqlite3",
    path: "/db/databases/"
    //
    //   user: process.env.PGUSER,
    //
    //   password: process.env.PGPASSWORD,
    //
    //   port: 5432,
    //
    //   host: "localhost"
    //
    `;
  }
};

module.exports = ({ projectName, adaptor }) => {
  return `

require("dotenv").config({ path: __dirname + ".env" });
const config = {};

// TODO: write informational comments here
const databaseDefaults = {
${adaptorType(adaptor)}
};

config.database = {
  development: {
    database: "${projectName}-dev",
    ...databaseDefaults
  },
  test: {
    database: "${projectName}-test",
    ...databaseDefaults
  },
  production: {
    database: "${projectName}-production",
    ...databaseDefaults
  }
};

module.exports = config;
  `;
};
