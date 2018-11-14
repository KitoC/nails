const db = require("./db");
const general = require("./general");
const logger = require("./logger");
const formatters = require("./formatters");
const fileManipulations = require("./file-manipulation");
const { nailsPaths, paths } = require("./paths");

module.exports = {
  ...general,
  ...db,
  ...fileManipulations,
  ...formatters,
  logger,
  nailsPaths,
  paths
};
