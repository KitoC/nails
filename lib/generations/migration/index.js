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
module.exports = ({ type, columns }, options, logger) => {
  const typeSplit = splitCamelcaseString(type);
  const migrationType = `${typeSplit[0]}_${typeSplit[1]}`;
  console.log(migrationType);
  switch (migrationType) {
    case "rename_columns":
      return require("./rename_columns")(typeSplit);

    default:
      return errorLog({
        message:
          "There are no migration types that match that type. \n\nValid migration types are as follows.\n",
        data: ["rename_columns"]
      });
  }
};
