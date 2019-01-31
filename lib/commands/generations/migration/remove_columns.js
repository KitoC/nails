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

  migrationFileName = fileNamify(action, newMigration);

  const modelName = pluralize(type[type.length - 1]).toLowerCase();

  executeFromRoot(root => {
    const migrationPath = paths.migrations(root, migrationFileName);

    validator
      .migrations({
        root,
        action: "REMOVE_COLUMNS",
        modelName,
        columns
      })
      .then(validatedColumns => {
        const newModel = {
          action: "REMOVE_COLUMNS",
          model: modelName,
          columns: validatedColumns
        };

        writeObjectToFile(migrationPath, newModel);
      })
      .catch(err => {
        logger.error(err);
      });
  });
};
