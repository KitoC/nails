const { errorLog, splitCamelcaseString } = require("../../../utils");
const rename_columns = require("./rename_columns");
const add_columns = require("./add_columns");
const remove_columns = require("./remove_columns");

const migrationTypes = { rename_columns, add_columns, remove_columns };

module.exports = ({ action, type, columns }) => {
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
