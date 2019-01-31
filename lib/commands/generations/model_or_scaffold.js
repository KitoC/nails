const pluralize = require("pluralize");
const {
  executeFromRoot,
  fileNamify,
  validator,
  writeObjectToFile,
  logger,
  paths
} = require("../../utils");

module.exports = ({ action, type, columns }, options) => {
  const migrationFileName = fileNamify(action, type);

  const modelName = pluralize(type).toLowerCase();

  executeFromRoot(root => {
    const migrationPath = paths.migrations(root, migrationFileName);

    validator
      .migrations({
        root,
        action: action === "model" ? "CREATE_MODEL" : "CREATE_SCAFFOLD",
        modelName,
        columns
      })
      .then(validatedColumns => {
        const newModel = {
          action: action === "model" ? "CREATE_MODEL" : "CREATE_SCAFFOLD",
          model: modelName,
          timestamps: true,
          columns: validatedColumns
        };

        writeObjectToFile(migrationPath, newModel);
        logger.info({
          msg: `A new ${action} migration has been generated: `,
          data: {
            model: modelName,
            timestamps: true,
            columns: validatedColumns
          }
        });
      })
      .catch(err => {
        logger.error(err);
      });
  });
};
