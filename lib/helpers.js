const localPath = process.cwd();
const configFile = require(`${localPath}/config.json`);

const rootCheck = () => {
  if (configFile.nailsProject === "nails-app") {
    return true;
  }
  return false;
};

const dataType = string => {
  switch (string.toLowerCase()) {
    case "string":
      return String;
    case "number":
      return Number;
  }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const formatSchema = arr => {
  return arr.map(col => {
    const colName = col.split(":")[0];
    const colType = col.split(":")[1];
    return ` ${colName}: ${capitalizeFirstLetter(colType)}`;
  });
};

module.exports = { rootCheck, localPath, formatSchema };
