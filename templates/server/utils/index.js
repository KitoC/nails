module.exports = () => {
  return `
const db = require("./db");
const stringFormatters = require("./stringFormatters");

module.exports = { ...db, ...stringFormatters };
    `;
};
