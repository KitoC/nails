const {
  executeFromRoot,
  mongooseDo,
  datafy,
  writeObjectToFile,
  shallowRemove
} = require("../../utils");

// const mongoose = require("mongoose");
const shell = require("shelljs");

// const shallowRemove = async (rootPath, migration, originalSchema) => {
//   shell.rm("-f", `${rootPath}/server/routes/${migration.model}.js`);

//   delete originalSchema.models[migration.model];

//   originalSchema.applied_migrations.pop();

//   return originalSchema;
// };

module.exports = async (migrationName, migration, originalSchema, rootPath) => {
  return new Promise(async (resolve, reject) => {
    resolve(shallowRemove(rootPath, migration, originalSchema, migrationName));
  });
};
