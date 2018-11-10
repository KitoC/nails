module.exports = () => {
  return `
const colors = require("colors/safe");

colors.setTheme({
  test: "cyan",
  info: "blue",
  warn: "yellow",
  success: "green",
  error: "red"
});

module.exports = colors;
    `;
};
