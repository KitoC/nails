const modelTemplate = require("../../../../templates/scaffold/model.js");
const fs = require("fs");
const {
  writeFile,
  capitalize,
  logger,
  nailsPaths,
  replaceTemplateVariables,
  timestamps
} = require("../../../utils");

module.exports = async (migration, root, database) => {
  return new Promise(async (resolve, reject) => {
    if (migration.timestamps) {
      migration.columns = {
        ...migration.columns,
        ...timestamps
      };
    }

    const modelPath = nailsPaths({
      name: "models",
      file: `${migration.model}.js`,
      root
    });

    const newModelFile = modelTemplate({
      columns: migration.columns,
      name: migration.model,
      scaffold: false
    });

    database.createTable(migration.model, migration.columns);

    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(modelPath, newModelFile, err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};
