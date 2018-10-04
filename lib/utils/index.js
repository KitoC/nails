const db = require("./db");
const general = require("./general");

module.exports = { ...general, ...db };
