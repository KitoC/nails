const { logger, removeFiles, paths } = require("../../../utils");

module.exports = ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    database.dropTable(migration.model).then(async () => {
      const file = `${migration.model}.js`;
      const modelPath = paths.models({ file, root });
      const routePath = paths.routes({ file, root });

      const removeFilesArray = [modelPath, routePath];

      await removeFiles(removeFilesArray)
        .then(res => {
          resolve(migrationFile);
        })
        .catch(err => {
          logger.error(err);
          reject();
          return;
        });
    });
  }).catch(err => {
    logger.error(err);
    reject();
    return;
  });
};
