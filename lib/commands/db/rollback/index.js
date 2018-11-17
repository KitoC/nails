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
      const database = await connectToDatabase({ root });

      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }

      const { appliedMigrations, applied_migrations } = migrationsArray({
        root,
        applied: true
      });

      if (parseInt(steps) > appliedMigrations.length) {
        return logger.error({
          msg: `You have specified too many rollbacks. There are only ${colors.warn(
            appliedMigrations.length
          )} possible rollbacks to be run.`
        });
      }

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
