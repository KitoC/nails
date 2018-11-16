const { timestamps, paths } = require("../../../utils");

const modelTemplate = require(paths.model_template({ steps: 2 }));

const fs = require("fs");

module.exports = (migration, root, database) => {
  return new Promise(async (resolve, reject) => {
    const file = `${migration.model}.js`;
    const modelPath = paths.models({ root, file });

    const model = require(modelPath);

    if (model.columns.created_at) {
      delete model.columns.created_at;
      delete model.columns.updated_at;
    }
    for (let key in migration.columns) {
      delete model.columns[key];
      database.removeColumn(migration.model, { [key]: migration.columns[key] });
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
