const fs = require("fs");
const pluralize = require("pluralize");
const util = require("util");
const {
  objectify,
  executeFromRoot,
  fileNamify,
  iterateFiles,
  writeObjectToFile,
  logger
} = require("../../utils");

let migrationFileName;
let duplicateModel;

module.exports = ({ action, type, columns }, options) => {
  migrationFileName = fileNamify(action, type);

  const modelName = pluralize(type).toLowerCase();

  try {
    executeFromRoot(rootPath => {
      const migrationPath = `${rootPath}/server/database/migrations/${migrationFileName}.js`;

      // TODO: find a better way of preventing duplicate migrations?? or not??
      iterateFiles(
        `${rootPath}/server/database/migrations/`,
        (filename, filenameSplit) => {
          if (
            filenameSplit[1] === "create" &&
            filenameSplit[2] === `${modelName}.js`
          ) {
            duplicateModel = true;
          }
        }
      );

      if (!duplicateModel) {
        let modelColumns = objectify(columns);

        if (modelColumns.passed) {
          modelColumns = { ...modelColumns.modelObject };

          const newModel = {
            action: action === "model" ? "CREATE_MODEL" : "CREATE_SCAFFOLD",
            model: modelName,
            timestamps: true,
            columns: modelColumns
          };

          writeObjectToFile(migrationPath, newModel);
          logger.info({
            msg: `A new ${action} migration has been generated: `,
            data: { model: modelName, timestamps: true, columns: modelColumns }
          });
        } else {
          throw {
            message:
              "One or more data types you have specified are incorrect: \n",
            data: modelColumns.wrongDataTypes
          };
        }
      } else {
        throw {
          message:
            "A model or scaffold migration with the same name has already been created."
        };
      }
    });
  } catch (err) {
    logger.error({
      err
    });
  }
};
