const modelTemplate = require("../../../templates/scaffold/model.js");
const fs = require("fs");

module.exports = (migration, rootPath) => {
  return new Promise(async (resolve, reject) => {
    const model = require(`${rootPath}/server/db/models/${migration.model}.js`);

    if (migration.model === "ghosts") {
      console.log("before change", migration.columns);
    }
    for (let key in migration.columns) {
      model.columns[key] = migration.columns[key];
    }
    if (migration.model === "ghosts") {
      console.log("after change", migration.columns);
    }

    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(
      `${rootPath}/server/db/models/${migration.model}.js`,
      modelTemplate({
        columns: model.columns,
        name: migration.model,
        scaffold: model.scaffold
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
