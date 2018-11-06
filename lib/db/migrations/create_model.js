const modelTemplate = require("../../../templates/scaffold/model.js");
const fs = require("fs");

module.exports = async (migration, rootPath) => {
  return new Promise(async (resolve, reject) => {
    if (migration.timestamps) {
      migration.columns = {
        ...migration.columns,
        created_at: { type: "date", default: "date.now" },
        updated_at: { type: "date", default: "date.now" }
      };
    }
    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(
      `${rootPath}/server/db/models/${migration.model}.js`,
      modelTemplate({
        columns: migration.columns,
        name: migration.model,
        scaffold: false
      }),
      err => {
        if (err) {
          throw err;
        }
        resolve();
      }
    );
  });
};
