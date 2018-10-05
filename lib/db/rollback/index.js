const colors = require("../../colors");
const shell = require("shelljs");

const fs = require("fs");
const util = require("util");
const { executeFromRoot, iterateFiles, mongooseDo } = require("../../utils");

let localPath;
// const appliedMigrations = [];
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");

const writeToSchema = schema => {
  // if (pendingMigrations) {
  fs.writeFile(
    `${localPath}/server/db/schema.js`,
    `module.exports = ${util.inspect(schema, {
      compact: false
    })}`,
    () => {
      console.log(success + "All rollbacks have been run.");
    }
  );
  // } else {
  //   console.log(migrationInfo + "There are no pending migrations.");
  // }
};

module.exports = (args, options, logger) => {
  try {
    executeFromRoot(root => {
      localPath = root;

      const migrationPath = `${localPath}/server/db/migrations/`;
      let originalSchema = require(`${localPath}/server/db/schema.js`);
      const appliedMigrations = originalSchema.applied_migrations;
      console.log("applied migrations", appliedMigrations);
      // iterateFiles(migrationPath, (filename, filenameSplit) => {
      //   appliedMigrations.push(filename);
      // });

      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }

      if (!appliedMigrations.length <= 0) {
        for (let i = 1; i <= steps; i++) {
          const migrationToRollback = require(`${localPath}/server/db/migrations/${
            appliedMigrations[appliedMigrations.length - 1]
          }`);

          originalSchema = require("./rollback-switch")(
            migrationToRollback,
            originalSchema
          );
        }
      }
      // console.log(originalSchema);
      writeToSchema(originalSchema);
    });
    // if (rbFinished) {

    // }
  } catch (err) {
    console.log(`${error}${colors.info(err)}`);
  }
};
