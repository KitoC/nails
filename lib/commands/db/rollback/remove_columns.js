const { timestamps, paths, modelFileGenerator } = require("../../../utils");

const fs = require("fs");

module.exports = ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    const file = `${migration.model}.js`;
    const modelPath = paths.models(root, file);

    const model = require(modelPath);

    if (model.columns.created_at) {
      delete model.columns.created_at;
      delete model.columns.updated_at;
    }

    for (let key in migration.columns) {
      delete model.columns[key];
      await database.removeColumn(migration.model, key);
    }

    await modelFileGenerator({
      ...migration,
      columns: { ...model.columns, ...timestamps },
      root
    });
    resolve(migrationFile);
  });
};
