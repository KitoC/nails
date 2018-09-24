const theme = require("colors/safe");

theme.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  success: "green",
  created: "cyan",
  data: "grey",
  connection: "magenta",
  info: "white",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red",
  deletion: "red",
  updated: "blue"
});

module.exports = theme;
