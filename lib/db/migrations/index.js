const colors = require("../../colors");
const fs = require("fs");
const util = require("util");
const { executeFromRoot, iterateFiles } = require("../../utils");

let localPath;
let pendingMigrations = false;
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");
const migrationInfo = colors.migration("Nails migration => ");

const writeToSchema = schema => {
  if (pendingMigrations) {
    fs.writeFile(
      `${localPath}/server/db/schema.js`,
      `module.exports = ${util.inspect(schema, {
        compact: false
      })}`,
      () => {
        console.log(success + "All pending migrations have been run.");
      }
    );
  } else {
    console.log(migrationInfo + "There are no pending migrations.");
  }
};

const ranMigration = (migration, migrations_already_run) => {
  return migrations_already_run.find(migr => migr === migration);
};

module.exports = () => {
  try {
    executeFromRoot(root => {
      localPath = root;
      const migrationPath = `${localPath}/server/db/migrations/`;
      const schema = require(`${localPath}/server/db/schema.js`);

      iterateFiles(migrationPath, (filename, filenameSplit) => {
        const migration = require(migrationPath + filename);
        if (!ranMigration(filename, schema.migrations_already_run)) {
          pendingMigrations = true;
          require("./migration_switch")(migration, schema, filename);
        }
      });

      writeToSchema(schema);
    });
  } catch (err) {
    console.log(`${error}${colors.info(err)}`);
  }
};
