const { deCapitalize } = require("../formatters");
const fs = require("fs");
const dataTypes = require("./data-types");

const pluralize = require("pluralize");
require("dotenv").config();
const util = require("util");

// force to snakeCase
const snakeCase = str => {
  return str.replace(/-/g, "_");
};

// format
const formatKey = key => {
  const formattedKey = snakeCase(deCapitalize(key));
  if (formattedKey.includes("_")) {
    return formattedKey.toLowerCase();
  }
  return formattedKey;
};

// NOTE: anything below is exported and used, anything above is utilized by the functions exported below

// Turns args.modelColumns into an actual javascript object.
const objectify = (modelColumns, root) => {
  const adaptor = require(`${root}/server/config.js`).database.development
    .adaptor;
  let passed = true;
  const modelObject = {};
  const wrongDataTypes = [];
  let hasForeignKeys = [];

  console.log(adaptor);

  modelColumns.map(col => {
    const colName = formatKey(col.split(":")[0]);
    let colType = col.split(":")[1].toLowerCase();
    if (colType === "foreign_key" || colType === "references") {
      colType = "foreign_key";
      modelObject[`${pluralize.singular(colName)}Id`] = {
        type: colType,
        table: pluralize(colName)
      };
      hasForeignKeys.push(pluralize(colName));
    } else {
      modelObject[colName] = { type: colType };
    }
  });

  for (let key in modelObject) {
    if (!dataTypes[adaptor][modelObject[key].type]) {
      passed = false;
      wrongDataTypes.push({ column: key, type: modelObject[key].type });
    }
  }
  if (passed) {
    return { passed, hasForeignKeys, modelObject };
  }
  return { passed, wrongDataTypes };
};

// Writes an updated schema back into the schema file
const writeObjectToFile = (path, object, message) => {
  fs.writeFile(
    path,
    `module.exports = ${util.inspect(object, {
      compact: false,
      depth: null
    })}`,
    err => {
      if (err) {
        throw err;
      }
    }
  );
};

// Removes the columns or models specified in the migraion that is being rolled back
const shallowRemove = async (
  rootPath,
  migration,
  originalSchema,
  migrationName
) => {
  // fs.unlink("path/file.txt", err => {
  //   if (err) throw err;
  //   console.log("path/file.txt was deleted");
  // });

  // shell.rm("-f", `${rootPath}/server/routes/${migration.model}.js`);

  if (
    migration.action === "CREATE_SCAFFOLD" ||
    migration.action === "CREATE_MODEL"
  ) {
    delete originalSchema.models[migration.model];
  } else {
    for (let key in migration.columns) {
      if (originalSchema.models[migration.model][key]) {
        delete originalSchema.models[migration.model][key];
      }
    }
  }

  delete originalSchema.applied_migrations[migrationName];

  if (migration.action === "CREATE_SCAFFOLD") {
    originalSchema.endpoints.pop();
  }

  return originalSchema;
};

// Takes migration columns and converts them into an object to $unset them from the database
const unsetify = migration => {
  const unset = { $unset: {} };
  for (key in migration.columns) {
    unset.$unset[key] = "";
  }
  return unset;
};

module.exports = {
  objectify,
  writeObjectToFile,
  shallowRemove,
  unsetify
};
