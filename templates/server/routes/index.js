const routes = {};
const fs = require("fs");

fs.readdirSync("./routes").forEach(file => {
  const fileStripped = file.split(".js")[0];
  if (fileStripped !== "index") {
    routes[fileStripped] = require(`./${file}`);
  }
});

module.exports = { ...routes };
