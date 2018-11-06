const { shallowRemove, updateDocuments, unsetify } = require("../../utils");
const modelTemplate = require("../../../templates/scaffold/model.js");
const fs = require("fs");

module.exports = async (migrationName, migration, originalSchema, rootPath) => {
  return new Promise(async (resolve, reject) => {
    const modelPath = `${rootPath}/server/db/models/${migration.model}.js`;

    const targetModel = require(modelPath);

    // const updater = unsetify(migration);
    // // console.log(updater);

    // await updateDocuments(rootPath, updater, migration.model);
    // await removeColumns(migration, targetModel, modelPath);

    resolve();
  });
};

const removeColumns = (migration, targetModel, modelPath) => {
  return new Promise(async (resolve, reject) => {
    for (let key in migration.columns) {
      delete targetModel.columns[key];
    }

    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(
      modelPath,
      modelTemplate({
        columns: targetModel.columns,
        name: migration.model,
        scaffold: false
      }),
      err => {
        if (err) {
          throw err;
        }
        resolve();
      }
    );
  });
};
