const fs = require("fs");

const {
  writeFile,
  capitalize,
  logger,
  paths,
  replaceTemplateVariables,
  timestamps
} = require("../../../utils");

const modelTemplate = require(paths.model_template({ steps: 2 }));

module.exports = async (migration, root, database) => {
  return new Promise(async (resolve, reject) => {
    if (migration.timestamps) {
      migration.columns = {
        ...migration.columns,
        ...timestamps
      };
    }

    const file = `${migration.model}.js`;
    const modelPath = paths.models({ file, root });
    const routePath = paths.routes({ file, root });

    database.createTable(migration.model, migration.columns);

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

    const templateDirectory = paths.route_template({ steps: 2 });

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
  });
};
