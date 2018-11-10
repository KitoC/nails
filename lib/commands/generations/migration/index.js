const {
  objectify,
  executeFromRoot,
  fileNamify,
  iterateFiles,
  errorLog,
  writeObjectToFile,
  splitCamelcaseString
} = require("../../utils");

let migrationFileName;
module.exports = ({ action, type, columns }, options, logger) => {
  const typeSplit = splitCamelcaseString(type);
  const migrationType = `${typeSplit[0]}_${typeSplit[1]}`;

  switch (migrationType) {
    case "rename_columns":
      return require("./rename_columns")(typeSplit, action, columns);

    case "add_columns":
      return require("./add_columns")(typeSplit, action, columns);

    case "remove_columns":
      return require("./remove_columns")(typeSplit, action, columns);

    default:
      return errorLog({
        message:
          "There are no migration types that match that type. \n\nValid migration types are as follows.\n",
        data: ["rename_columns", "add_columns", "remove_columns"]
      });
  }
};
