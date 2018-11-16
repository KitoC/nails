const {
  objectify,
  executeFromRoot,
  fileNamify,
  logger,
  writeObjectToFile,
  migrationValidator,
  paths
} = require("../../../utils");
const pluralize = require("pluralize");

module.exports = (type, action, columns) => {
  let newMigration = "";
  type.map(n => {
    newMigration += `_${n}`;
  });

  migrationFileName = fileNamify(action, newMigration);

  const newModelName = pluralize(type[type.length - 1]).toLowerCase();

  try {
    executeFromRoot(root => {
      const migrationPath = paths.migrations({
        root,
        file: migrationFileName
      });

      let newModelColumns = objectify(columns);

      const { columnsExist, invalidColumns, modelExists } = migrationValidator({
        root,
        action: "REMOVE_COLUMNS",
        newModelName,
        newModelColumns
      });

      if (
        newModelColumns.passed &&
        !invalidColumns.length &&
        modelExists &&
        columnsExist.length < 1
      ) {
        newModelColumns = { ...newModelColumns.modelObject };

        const newModel = {
          action: "REMOVE_COLUMNS",
          model: newModelName,
          columns: newModelColumns
        };

        writeObjectToFile(migrationPath, newModel);
      } else {
        let msg;

        if (columnsExist.length > 0) {
          msg = {
            code: "remove_column_migration_exists",
            data: { model: newModelName, columns: columnsExist }
          };
        }

        if (invalidColumns.length > 0) {
          msg = {
            code: "columns_dont_exist_on_table",
            data: { model: newModelName, columns: invalidColumns }
          };
        }

        if (!modelExists) {
          msg = {
            code: "model_does_not_exist",
            after: newModelName
          };
        }

        if (!newModelColumns.passed) {
          msg = {
            msg: "One or more data types you have specified are incorrect: \n",
            data: newModelColumns.wrongDataTypes
          };
        }
        throw msg;
      }
    });
  } catch (err) {
    logger.error(err);
  }
};
