const colors = require("colors/safe");

colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  success: "green",
  data: "grey",
  info: "yellow",
  warn: "yellow",
  debug: "blue",
  error: "red"
});

module.exports = colors;
