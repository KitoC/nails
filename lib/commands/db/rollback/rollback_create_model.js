const {
  executeFromRoot,
  mongooseDo,
  datafy,
  logger,
  removeFiles
} = require("../../utils");

module.exports = (rootPath, database, migration) => {
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const modelPath = nailsPaths({
      name: "models",
      file: `${migration.model}.js`,
      root
    });

    const removeFilesArray = [modelPath];

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
