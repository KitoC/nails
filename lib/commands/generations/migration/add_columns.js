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

  const migrationFileName = fileNamify(action, newMigration);

  const newModelName = pluralize(type[type.length - 1]).toLowerCase();

  try {
    executeFromRoot(root => {
      const migrationPath = paths.migrations({
        root,
        file: migrationFileName
      });

      let newModelColumns = objectify(columns);

      const { columnsExist, modelExists, nullReferences } = migrationValidator({
        root,
        action: "ADD_COLUMNS",
        newModelName,
        newModelColumns
      });

      if (
        nullReferences.length < 1 &&
        newModelColumns.passed &&
        modelExists &&
        columnsExist.length < 1
      ) {
        newModelColumns = { ...newModelColumns.modelObject };

        const newModel = {
          action: "ADD_COLUMNS",
          model: newModelName,
          columns: newModelColumns
        };

        writeObjectToFile(migrationPath, newModel);
        logger.success({ code: "generation_add_column", data: newModel });
      } else {
        let err;

        if (nullReferences) {
          err = {
            code: "null_reference",
            data: { models: nullReferences }
          };
        }

        if (columnsExist.length > 0) {
          err = {
            code: "add_column_migration_exists",
            data: { model: newModelName, columns: columnsExist }
          };
        }

        if (!modelExists) {
          err = {
            code: "model_does_not_exist",
            after: newModelName
          };
        }

        if (!newModelColumns.passed) {
          err = {
            msg: "One or more data types you have specified are incorrect: \n",
            data: newModelColumns.wrongDataTypes
          };
        }
        throw err;
      }
    });
  } catch (err) {
    if (err.code) {
      logger.error(err);
      return;
    }
    logger.error({ err });
  }
};
