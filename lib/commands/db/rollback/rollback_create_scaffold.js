const { logger, removeFiles, paths } = require("../../../utils");

module.exports = ({ migration, root, database }) => {
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const file = `${migration.model}.js`;
    const modelPath = paths.models({ file, root });
    const routePath = paths.routes({ file, root });

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
