const colors = require("../../../utils/colors");

const rollbackSwitch = require("./rollback_switch");
const {
  executeFromRoot,
  handleAppliedMigrationsFile,
  migrationsArray,
  runSyncLoop,
  logger,
  connectToDatabase
} = require("../../../utils");

module.exports = async (args, options) => {
  try {
    executeFromRoot(async root => {
      let { appliedMigrations, applied_migrations } = migrationsArray({
        root,
        applied: true
      });

      let steps;
      let batch;
      steps = 1;

      if (args.type[0] && args.type[0].includes("batch")) {
        batch = args.type[0].split("batch=")[1];

        appliedMigrations = appliedMigrations.filter(
          migration => migration.batch === batch
        );
        steps = appliedMigrations.length;
      } else if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }

      if (parseInt(steps) > appliedMigrations.length) {
        return logger.error({
          msg: `You have specified too many rollbacks. There are only ${colors.warn(
            appliedMigrations.length
          )} possible rollbacks to be run.`
        });
      }
      const database = await connectToDatabase({ root });

      const migrationsToRollback = appliedMigrations
        .slice(Math.max(appliedMigrations.length - steps))
        .reverse();

      const responses = await runSyncLoop(
        rollbackSwitch,
        migrationsToRollback,
        {
          database,
          root
        }
      );

      handleAppliedMigrationsFile({ applied_migrations, responses, root });
    });
  } catch (err) {
    logger.error({ err });
  }
};
