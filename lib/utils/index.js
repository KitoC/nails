const db = require("./db");
const general = require("./general");
const logger = require("./logger");

module.exports = { ...general, ...db, logger };
