const { nailsPaths, timestamps } = require("../../../utils");

const modelTemplate = require(nailsPaths({ steps: 3, name: "model_template" }));
const fs = require("fs");

module.exports = (migration, rootPath, database) => {
  return new Promise(async (resolve, reject) => {
    const modelPath = nailsPaths({
      name: "models",
      root: rootPath,
      file: `${migration.model}.js`
    });

    const model = require(modelPath);

    if (model.columns.created_at) {
      delete model.columns.created_at;
      delete model.columns.updated_at;
    }
    for (let key in migration.columns) {
      model.columns[key] = migration.columns[key];
      database.addColumn(migration.model, { [key]: migration.columns[key] });
    }

    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(
      modelPath,
      modelTemplate({
        columns: { ...model.columns, ...timestamps },
        name: migration.model,
        scaffold: model.scaffold
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
