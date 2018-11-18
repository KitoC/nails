const moment = require("moment");

const migrationSwitch = require("./migration_switch");
const {
  executeFromRoot,
  handleAppliedMigrationsFile,
  logger,
  connectToDatabase,
  migrationsArray,
  runSyncLoop
} = require("../../../utils");

module.exports = () => {
  try {
    executeFromRoot(async root => {
      const batchDate = moment().format("YYYYMMDDHHmmss");

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
        logger.info({
          code: "no_migrations_to_Run"
        });
      }
    });
  } catch (err) {
    logger.error({ err });
  }
};
