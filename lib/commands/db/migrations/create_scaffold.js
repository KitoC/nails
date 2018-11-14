const fs = require("fs");

const {
  writeFile,
  capitalize,
  logger,
  nailsPaths,
  replaceTemplateVariables,
  timestamps
} = require("../../../utils");

const {
  modelTemplate,
  routeTemplateBE
} = require("../../../../templates/scaffold");

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

    const routePath = nailsPaths({
      name: "routes",
      file: `${migration.model}.js`,
      root
    });
    database.createTable(migration.model, migration.columns);

    // Writes to the model file e.g. "./models/posts.js"
    fs.writeFile(
      modelPath,
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
      writeFile(routePath, replacedVarsFile);
    });
    // Writes to the model file e.g. "./models/posts.js"
  });
};
