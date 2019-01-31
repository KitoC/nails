const { paths, logger, removeFiles } = require("../../../utils");

module.exports = ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const file = `${migration.model}.js`;
    const modelPath = paths.models(root, file);

    const removeFilesArray = [modelPath];

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
};
