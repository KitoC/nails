const fs = require("fs");

const { writeFile, capitalize } = require("../../../utils");
const {
  modelTemplate,
  routeTemplateBE
} = require("../../../../templates/scaffold");

module.exports = async (migration, rootPath, database) => {
  return new Promise(async (resolve, reject) => {
    if (migration.timestamps) {
      migration.columns = {
        ...migration.columns,
        created_at: { type: "date", default: "date.now" },
        updated_at: { type: "date", default: "date.now" }
      };
    }

    console.log("create table");
    database.createTable(migration.model, migration.columns);

    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(
      `${rootPath}/server/database/schema/${migration.model}.js`,
      modelTemplate({
        columns: migration.columns,
        name: migration.model,
        scaffold: true
      }),
      err => {
        if (err) {
          throw err;
        }
        resolve();
      }
    );

    const templateFile = await fs.readFileSync(
      `${__dirname}/../../../../../templates/scaffold/route`,
      "utf8"
    );
    const replacedVarsFile = templateFile.replace(
      /\[\[(PROJECT_NAME?)\]\]/g,
      migration.model
    );
    // Writes to the model file e.g. "./models/posts.js"

    // logger.info({ msg: ` file: ${parentDirectory}/${file}` });
    writeFile(
      `${rootPath}/server/routes/${migration.model}.js`,
      replacedVarsFile
    );
  });
};
