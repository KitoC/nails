const moment = require("moment");
const { inspect } = require("util");
const {
  executeFromRoot,
  iterateFiles,
  nailsSuccess,
  errorLog,
  infoLog,
  writeFile
} = require("../../utils");

let pendingMigrations = [];
let batchDate;

const migrationLoop = async (
  pendingMigrations,
  applied_migrations,
  rootPath
) => {
  // console.log("migrationLoop", pendingMigrations, applied_migrations);

  for (let pendingMigration of pendingMigrations) {
    const migration = require(pendingMigration.path);

    // console.log(migration.model);
    const migrationAction = require("./migration_switch")(migration.action);
    await migrationAction(migration, rootPath);
    applied_migrations[pendingMigration.filename] = { batch: batchDate };
    infoLog({
      action: "migration",
      message: `${pendingMigration.filename} 🤓`
    });
  }
  writeFile(
    `${rootPath}/server/db/migrations/applied_migrations.js`,
    `module.exports = ${inspect(applied_migrations, {
      compact: false,
      depth: null
    })}`
  );
  return;
};

// const migrationAction = async () => {};

module.exports = () => {
  try {
    executeFromRoot(rootPath => {
      const migrationPath = `${rootPath}/server/db/migrations/`;
      const { applied_migrations } = require(`${rootPath}/server/db/`);

      batchDate = moment().format("YYYYMMDDHHmmss");

      iterateFiles(migrationPath, async (filename, filenameSplit) => {
        if (
          !applied_migrations[filename] &&
          filename !== "applied_migrations.js"
        ) {
          pendingMigrations.push({ path: migrationPath + filename, filename });
        }
      });
      // console.log(applied_migrations);

      if (pendingMigrations.length > 0) {
        // console.log("in last check", pendingMigrations);
        migrationLoop(pendingMigrations, applied_migrations, rootPath);

        // writeObjectToFile(schemaPath, schema, {
        //   message: "All pending migrations have been run. \n"
        // });
      } else {
        infoLog({
          action: "Nails migration",
          message: "There are no pending migrations."
        });
      }
    });
  } catch (err) {
    errorLog(err);
  }
};
