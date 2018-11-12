const numbers = require("./numbers");
const strings = require("./strings");

module.exports = {
  ...numbers,
  ...strings
};
