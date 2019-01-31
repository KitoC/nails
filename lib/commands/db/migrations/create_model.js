const { timestamps, modelFileGenerator } = require("../../../utils");

module.exports = async ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    if (migration.timestamps) {
      migration.columns = {
        ...migration.columns,
        ...timestamps
      };
    }

    await modelFileGenerator({ ...migration, root });
    database.createTable(migration.model, migration.columns);
    resolve(migrationFile);
  });
};
