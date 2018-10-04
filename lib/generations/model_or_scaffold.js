const colors = require("../colors");
const fs = require("fs");
const pluralize = require("pluralize");
const util = require("util");
const {
  objectify,
  executeFromRoot,
  fileNamify,
  iterateFiles
} = require("../utils");

let localPath;
let migrationFileName;
let duplicateModel;
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");

const generateModel = newModel => {
  fs.writeFile(
    `${localPath}/server/db/migrations/${migrationFileName}.js`,
    `module.exports = ${util.inspect(newModel, { compact: false })}`,
    err => {
      if (err) throw err;
      console.log(
        `${success}${colors.info("New model migration has been generated.")}`
      );
    }
  );
};

module.exports = ({ action, type, columns }, options, logger) => {
  migrationFileName = fileNamify({ action, type });

  const modelName = pluralize(type).toLowerCase();

  try {
    executeFromRoot(root => {
      localPath = root;
      // TODO: find a better way of preventing duplicate migrations?? or not??
      iterateFiles(
        `${localPath}/server/db/migrations/`,
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
        let newModel = objectify(columns);

        if (newModel.passed) {
          newModel = { ...newModel.modelObject };

          generateModel({
            action: action === "model" ? "CREATE_MODEL" : "CREATE_SCAFFOLD",
            model: modelName,
            timestamps: true,
            columns: newModel
          });
        }
      } else {
        console.log(
          `${error}${colors.info(
            "A model migration with the same name has already been created!"
          )}`
        );
      }
    });
  } catch (err) {
    console.log(`${error}${colors.info(err)}`);
  }
};
