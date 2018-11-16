const moment = require("moment");
const Hammered = require("hammered-orm");
const { inspect } = require("util");
const migrationSwitch = require("./migration_switch");
const {
  executeFromRoot,
  iterateFiles,
  infoLog,
  writeFile,
  logger
} = require("../../../utils");

let pendingMigrations = [];
let batchDate;

const migrationLoop = async (pendingMigrations, applied_migrations, root) => {
  const config = require(`${root}/server/config.js`);
  const development = config.database.development;

  development.path = `/server${development.path}`;

  const database = new Hammered({ config: development });

  await database.connect(() => {});
  if (development.adaptor === "sqlite3") {
    database.serialize();
  }

  for (let pendingMigration of pendingMigrations) {
    const migration = require(pendingMigration.path);

    await migrationSwitch[migration.action]({ migration, root, database });
    applied_migrations[pendingMigration.filename] = { batch: batchDate };

    logger.custom({
      template: "nails migration => ",
      msg: `${pendingMigration.filename} 🤓`,
      color: "warn"
    });
  }
  // await disconnect();
  writeFile(
    `${root}/server/database/migrations/applied_migrations.js`,
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
    executeFromRoot(async root => {
      const migrationPath = `${root}/server/database/migrations/`;
      const applied_migrations = require(`${root}/server/database/migrations/applied_migrations`);

      batchDate = moment().format("YYYYMMDDHHmmss");

      iterateFiles(migrationPath, async (filename, filenameSplit) => {
        if (
          !applied_migrations[filename] &&
          filename !== "applied_migrations.js"
        ) {
          pendingMigrations.push({ path: migrationPath + filename, filename });
        }
      });

      if (pendingMigrations.length > 0) {
        migrationLoop(pendingMigrations, applied_migrations, root);

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
