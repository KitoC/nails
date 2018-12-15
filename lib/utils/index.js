const db = require("./db");
const general = require("./general");
const logger = require("./logger");
const formatters = require("./formatters");
const fileManipulations = require("./file-manipulation");
const { nailsPaths, paths } = require("./paths");
const validator = require("./validators");

module.exports = {
  ...general,
  ...db,
  ...fileManipulations,
  ...formatters,
  validator,
  logger,
  nailsPaths,
  paths
};
