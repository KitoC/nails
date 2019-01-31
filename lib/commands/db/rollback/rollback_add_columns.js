const { paths, modelFileGenerator } = require("../../../utils");

module.exports = async ({ migration, root, database }) => {
  return new Promise(async (resolve, reject) => {
    const file = `${migration.model}.js`;
    const modelPath = paths.models(root, file);

    const model = require(modelPath);

    await modelFileGenerator({
      ...migration,
      columns: removeColumns(model, migration, database),
      root
    });
    resolve();

    // fs.writeFile(
    //   modelPath,
    //   modelTemplate({
    //     columns: removeColumns(model, migration, database),
    //     name: migration.model,
    //     scaffold: model.scaffold
    //   }),
    //   err => {
    //     if (err) {
    //       throw err;
    //     }
    //     resolve();
    //   }
    // );

    // resolve();
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
