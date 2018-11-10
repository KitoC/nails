const {
  objectify,
  executeFromRoot,
  fileNamify,
  errorLog,
  writeObjectToFile
} = require("../../utils");
const pluralize = require("pluralize");

module.exports = (type, action, columns) => {
  console.log("in add_columns.js", type);
  let newMigration = "";
  type.map(n => {
    newMigration += `_${n}`;
  });

  migrationFileName = fileNamify(action, newMigration);

  const modelName = pluralize(type[type.length - 1]).toLowerCase();

  try {
    executeFromRoot(rootPath => {
      const migrationPath = `${rootPath}/server/db/migrations/${migrationFileName}`;

      let modelColumns = objectify(columns);

      if (modelColumns.passed) {
        modelColumns = { ...modelColumns.modelObject };

        const newModel = {
          action: "ADD_COLUMNS",
          model: modelName,
          columns: modelColumns
        };

        writeObjectToFile(migrationPath, newModel, {
          message: `A new add_columns migration has been generated for the "${modelName}" model.\n\n`,
          data: { model: modelName, columns: modelColumns }
        });
      } else {
        throw {
          message:
            "One or more data types you have specified are incorrect: \n",
          data: modelColumns.wrongDataTypes
        };
      }
    });
  } catch (err) {
    errorLog(err);
  }
};
