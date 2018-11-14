const { logger, removeFiles, nailsPaths } = require("../../../utils");

module.exports = (root, database, migration) => {
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const modelPath = nailsPaths({
      name: "models",
      file: `${migration.model}.js`,
      root
    });

    const routePath = nailsPaths({
      name: "routes",
      file: `${migration.model}.js`,
      root
    });

    const removeFilesArray = [modelPath, routePath];

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
