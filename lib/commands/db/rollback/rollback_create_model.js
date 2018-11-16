const { paths, logger, removeFiles } = require("../../../utils");

module.exports = ({ migration, root, database }) => {
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const file = `${migration.model}.js`;
    const modelPath = paths.models({ file, root });

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
