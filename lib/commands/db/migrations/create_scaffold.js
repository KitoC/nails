const { logger, timestamps, modelFileGenerator } = require("../../../utils");

module.exports = async ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    database
      .createTable(migration.model, migration.columns)
      .then(async () => {
        if (migration.timestamps) {
          migration.columns = {
            ...migration.columns,
            ...timestamps
          };
        }
        await modelFileGenerator({ ...migration, root, scaffold: true });
        resolve(migrationFile);
      })

      .catch(err => {
        logger.error(err);
        reject();
        return;
      });
  });
};
