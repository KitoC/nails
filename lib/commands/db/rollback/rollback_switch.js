const CREATE_SCAFFOLD = require("./rollback_create_scaffold");
const CREATE_MODEL = require("./rollback_create_model");
const ADD_COLUMNS = require("./rollback_add_columns");
const REMOVE_COLUMNS = require("../migrations/add_columns");

module.exports = {
  CREATE_SCAFFOLD,
  CREATE_MODEL,
  ADD_COLUMNS,
  REMOVE_COLUMNS
};
