const { schema } = require("../database");

const socketDBSchema = {
  event: "schema",
  data: schema
};

module.exports = socketDBSchema;
