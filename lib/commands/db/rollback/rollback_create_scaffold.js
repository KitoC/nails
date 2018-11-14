const { logger, removeFiles } = require("../../../utils");

module.exports = (rootPath, database, migration) => {
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const removeFilesArray = [
      `${rootPath}/server/database/models/${migration.model}.js`,
      `${rootPath}/server/routes/${migration.model}.js`
    ];

    await removeFiles(removeFilesArray)
      .then(res => {
        resolve();
      })
      .catch(err => {
        logger.error(err);
        reject();
        return;
      });
  });
};
