const { timestamps, modelFileGenerator, paths } = require("../../../utils");

module.exports = ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    const file = `${migration.model}.js`;
    const modelPath = paths.models(root, file);
    const model = await require(modelPath);

    if (model.columns.created_at) {
      delete model.columns.created_at;
      delete model.columns.updated_at;
    }
    for (let key in migration.columns) {
      model.columns[key] = migration.columns[key];
      database.addColumn(migration.model, { [key]: migration.columns[key] });
    }

    await modelFileGenerator({
      ...migration,
      columns: { ...model.columns, ...timestamps },
      root
    });
    resolve(migrationFile);
  });
};
