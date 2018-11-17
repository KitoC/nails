const moment = require("moment");

const migrationSwitch = require("./migration_switch");
const {
  executeFromRoot,
  handleAppliedMigrationsFile,
  infoLog,
  logger,
  connectToDatabase,
  migrationsArray,
  runSyncLoop
} = require("../../../utils");

let batchDate;

module.exports = () => {
  try {
    executeFromRoot(async root => {
      batchDate = moment().format("YYYYMMDDHHmmss");

      const { pendingMigrations, applied_migrations } = migrationsArray({
        root,
        pending: true
      });

      if (pendingMigrations.length > 0) {
        const database = await connectToDatabase({ root });

        const responses = await runSyncLoop(
          migrationSwitch,
          pendingMigrations,
          {
            database,
            root
          }
        );

        handleAppliedMigrationsFile({
          applied_migrations,
          responses,
          root,
          batchDate,
          isMigration: true
        });
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
