const moment = require("moment");
const Hammered = require("hammered-orm");
const { inspect } = require("util");
const {
  executeFromRoot,
  iterateFiles,
  nailsSuccess,
  errorLog,
  infoLog,
  writeFile,
  logger
} = require("../../../utils");

let pendingMigrations = [];
let batchDate;

const migrationLoop = async (
  pendingMigrations,
  applied_migrations,
  rootPath
) => {
  // console.log("migrationLoop", pendingMigrations, applied_migrations);
  const { database } = require(`${rootPath}/server/config.js`);

  database.development.path = `/server${database.development.path}`;

  console.log(database.development.path);
  const db = new Hammered({ config: database.development });
  db.verbose();
  await db.connect(() => {
    console.log("after");
  });
  if (database.development.adaptor === "sqlite3") {
    db.serialize();
  }

  for (let pendingMigration of pendingMigrations) {
    const migration = require(pendingMigration.path);

    // console.log(migration.model);
    const migrationAction = require("./migration_switch")(migration.action);
    await migrationAction(migration, rootPath, db);
    applied_migrations[pendingMigration.filename] = { batch: batchDate };
    infoLog({
      action: "migration",
      message: `${pendingMigration.filename} 🤓`
    });
  }
  writeFile(
    `${rootPath}/server/database/migrations/applied_migrations.js`,
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
    executeFromRoot(async rootPath => {
      const migrationPath = `${rootPath}/server/database/migrations/`;
      const applied_migrations = require(`${rootPath}/server/database/migrations/applied_migrations`);

      batchDate = moment().format("YYYYMMDDHHmmss");

      iterateFiles(migrationPath, async (filename, filenameSplit) => {
        if (
          !applied_migrations[filename] &&
          filename !== "applied_migrations.js"
        ) {
          console.log(filename);
          pendingMigrations.push({ path: migrationPath + filename, filename });
        }
      });

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
    logger.error({ err });
  }
};
