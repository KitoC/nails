const fs = require("fs");
const { paths, timestamps } = require("../../../utils");

const modelTemplate = require(paths.model_template({ steps: 2 }));

module.exports = async ({ migration, root, database, file: migrationFile }) => {
  return new Promise(async (resolve, reject) => {
    if (migration.timestamps) {
      migration.columns = {
        ...migration.columns,
        ...timestamps
      };
    }

    const file = `${migration.model}.js`;
    const modelPath = paths.models({ file, root });

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
      resolve(migrationFile);
    });
  });
};
