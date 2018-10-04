const shell = require("shelljs");
const colors = require("../colors");
const fs = require("fs");
const pluralize = require("pluralize");
const util = require("util");
const { capitalize, objectify, executeFromRoot } = require("../utils");

let localPath;

const scaffoldModel = (args, options, modelNamePluralized) => {
  const schema = require(`${localPath}/server/db/schema.js`);

  if (!schema.models[modelNamePluralized]) {
    // Adds new model to endpoints array
    schema.endpoints.push(modelNamePluralized);

    // Adds defaults to objectified model fields
    const defaults = { created_at: "date", updated_at: "date" };
    let newModel = objectify(args.modelColumns);
    if (newModel.passed) {
      newModel.modelObject = { ...newModel.modelObject, ...defaults };

      // Adds new model's name as a kew to the models object in schema and then applies the model data-fields to the key
      schema.models[modelNamePluralized] = newModel.modelObject;

      fs.writeFile(
        `${localPath}/server/db/schema.js`,
        `module.exports = ${util.inspect(schema, {
          compact: false
        })}`,
        "utf8",
        (callback = err => {
          if (err) {
            console.log(err, "\nJSON read error path: ", path);
          }
          console.log(
            `${colors.success("\nNails success! ")}${colors.info(
              `The "${capitalize(
                modelNamePluralized
              )}" model was created and inserted into schema.`
            )}`
          );
        })
      );
    } else {
      console.log(
        `${colors.error("\nNails error! ")}${colors.info(
          `The following data types you have specified for your model aren't valid. 
          ${colors.warn(util.inspect(newModel.wrongDataTypes))}`
        )}`
      );
    }
  } else {
    console.log(
      `${colors.error("\nNails error! ")}${colors.info(
        "You cannot create models with duplicate names."
      )}`
    );
  }
};

module.exports = (args, options, logger) => {
  const modelNamePluralized = pluralize(args.modelName).toLowerCase();

  try {
    executeFromRoot(root => {
      localPath = root;
      scaffoldModel(args, options, modelNamePluralized);
    });
  } catch (err) {
    console.log(`${colors.error("\nNails error! ")}${colors.info(err)}`);
  }
};
