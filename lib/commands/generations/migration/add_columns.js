const {
  executeFromRoot,
  fileNamify,
  logger,
  writeObjectToFile,
  validator,
  paths
} = require("../../../utils");
const pluralize = require("pluralize");

module.exports = (type, action, columns) => {
  let newMigration = "";
  type.map(n => {
    newMigration += `_${n}`;
  });

  const migrationFileName = fileNamify(action, newMigration);

  const modelName = pluralize(type[type.length - 1]).toLowerCase();

  executeFromRoot(root => {
    const migrationPath = paths.migrations({
      root,
      file: migrationFileName
    });

    validator
      .migrations({
        root,
        action: "ADD_COLUMNS",
        modelName,
        columns
      })
      .then(validatedColumns => {
        const newModel = {
          action: "ADD_COLUMNS",
          model: modelName,
          columns: validatedColumns
        };

        writeObjectToFile(migrationPath, newModel);
        logger.success({ code: "generation_add_column", data: newModel });
      })
      .catch(err => {
        logger.error(err);
      });
  });
};
