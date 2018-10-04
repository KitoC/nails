const colors = require("../../colors");
const fs = require("fs");
const util = require("util");
const { executeFromRoot, iterateFiles } = require("../../utils");

let localPath;
const runMigrations = [];
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");

module.exports = (args, options, logger) => {
  try {
    executeFromRoot(root => {
      localPath = root;
      const migrationPath = `${localPath}/server/db/migrations/`;

      iterateFiles(migrationPath, (filename, filenameSplit) => {
        runMigrations.push(filename);
      });
      console.log(runMigrations);
    });
  } catch (err) {
    console.log(`${error}${colors.info(err)}`);
  }
};
