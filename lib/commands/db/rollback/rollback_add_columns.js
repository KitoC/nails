const { paths } = require("../../../utils");

const modelTemplate = require(paths.model_template({ steps: 2 }));

const fs = require("fs");

module.exports = async (root, database, migration) => {
  return new Promise(async (resolve, reject) => {
    const file = `${migration.model}.js`;
    const modelPath = paths.models({ file, root });

    const model = require(modelPath);

    fs.writeFile(
      modelPath,
      modelTemplate({
        columns: removeColumns(model, migration, database),
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

    resolve();
  });
};

const removeColumns = (model, migration, database) => {
  for (let key in migration.columns) {
    delete model.columns[key];
    // TODO: fix hammered removeColumn func
    database.removeColumn(model.model, key);
  }
  return model.columns;
};
