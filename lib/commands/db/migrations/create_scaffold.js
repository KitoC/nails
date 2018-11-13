const fs = require("fs");

const {
  writeFile,
  capitalize,
  logger,
  replaceTemplateVariables
} = require("../../../utils");
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

    const templateDirectory =
      __dirname + "/../../../../templates/scaffold/route.js";
    const templateFile = await fs.readFileSync(templateDirectory, "utf8");

    const provided = {
      value: capitalize(migration.model),
      regex: /\[\[(MODEL_NAME?)\]\]/g
    };

    replaceTemplateVariables(templateFile, {
      provided
    }).then(replacedVarsFile => {
      writeFile(
        `${rootPath}/server/routes/${migration.model}.js`,
        replacedVarsFile
      );
    });
    // Writes to the model file e.g. "./models/posts.js"
  });
};
