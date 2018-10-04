const shell = require("shelljs");
const colors = require("./colors");
const fs = require("fs");
const pluralize = require("pluralize");
const util = require("util");
const {
  readWriteToJSON,
  formatModelString,
  capitalize,
  objectify,
  executeFromRoot
} = require("./utils/general");

let localPath;
const scaffoldTest = args => {
  const schema = require(`${localPath}/server/db/schema.js`);

  const defaults = { created_at: "date", updated_at: "date" };
  let newSchemaEntry = objectify(args.modelColumns);
  newSchemaEntry = { ...newSchemaEntry, ...defaults };

  schema.models[args.modelName] = newSchemaEntry;

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
      console.log("readWriteToJSON was successful");
    })
  ); // write it back
};

module.exports = (args, options, logger) => {
  console.log(__dirname);
  try {
    executeFromRoot(root => {});
  } catch (err) {
    console.log(`${colors.error("\nNails error! ")}${colors.info(err)}`);
  }
};
