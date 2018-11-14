const {
  objectify,
  executeFromRoot,
  fileNamify,
  logger,
  writeObjectToFile,
  nailsPaths,
  paths
} = require("../../../utils");
const pluralize = require("pluralize");
const fs = require("fs");

module.exports = (type, action, columns) => {
  let newMigration = "";
  type.map(n => {
    newMigration += `_${n}`;
  });

  migrationFileName = fileNamify(action, newMigration);

  const modelName = pluralize(type[type.length - 1]).toLowerCase();

  try {
    executeFromRoot(root => {
      const file = `${modelName}.js`;
      const modelPath = paths.models({ root, file });
      const migrationPath = paths.migrations({
        root,
        file: migrationFileName
      });

      let modelColumns = objectify(columns);

      const checkColumns = [];

      // TODO: refactor this to loop  through migrations and check the attempted column migration against existing column migrqations instead.
      if (fs.existsSync(modelPath)) {
        const originalModel = require(modelPath);

        for (let key in originalModel.columns) {
          if (modelColumns.modelObject[key]) {
            console.log(key);
            checkColumns.push(key);
          }
        }
      }

      if (modelColumns.passed && checkColumns.length < 1) {
        modelColumns = { ...modelColumns.modelObject };

        const newModel = {
          action: "ADD_COLUMNS",
          model: modelName,
          columns: modelColumns
        };

        writeObjectToFile(migrationPath, newModel);
      } else {
        let msg;
        console.log(checkColumns);
        if (checkColumns.length > 0) {
          msg = {
            msg:
              "You are attempting to add a column to a table that already exists.",
            data: checkColumns
          };
        } else {
          msg = {
            msg: "One or more data types you have specified are incorrect: \n",
            data: modelColumns.wrongDataTypes
          };
        }
        throw msg;
      }
    });
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
};
