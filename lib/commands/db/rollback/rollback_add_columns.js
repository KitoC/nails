const {
  shallowRemove,
  updateDocuments,
  nailsPaths
} = require("../../../utils");
const modelTemplate = require(nailsPaths({ steps: 3, name: "model_template" }));
const fs = require("fs");

module.exports = async (rootPath, database, migration) => {
  return new Promise(async (resolve, reject) => {
    const modelPath = nailsPaths({
      name: "models",
      root: rootPath,
      file: `${migration.model}.js`
    });

    const model = require(modelPath);

    fs.writeFile(
      modelPath,
      modelTemplate({
        columns: removeColumns(model, migration),
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

    resolve();
  });
};

const removeColumns = (model, migration) => {
  for (let key in migration.columns) {
    delete model.columns[key];
  }
  return model.columns;
};
