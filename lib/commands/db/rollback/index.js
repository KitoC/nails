const colors = require("../../../utils/colors");
const { inspect } = require("util");
const Hammered = require("hammered-orm");
const rollbackSwitch = require("./rollback_switch");
const {
  executeFromRoot,
  writeFile,
  iterateFiles,
  runSyncLoop,
  paths,
  logger
} = require("../../../utils");

module.exports = async (args, options) => {
  try {
    executeFromRoot(async root => {
      const config = require(`${root}/server/config.js`);
      const development = config.database.development;
      development.path = `/server${development.path}`;
      const database = new Hammered({ config: development });

      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }

      const { appliedMigrations, applied_migrations } = appliedMigrationsArray(
        root
      );

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

      await database.connect(() => {});

      if (development.adaptor === "sqlite3") {
        database.serialize();
      }

      const responses = await runSyncLoop(
        rollbackSwitch,
        migrationsToRollback,
        {
          database,
          root
        }
      );

      writeFile(
        `${root}/server/database/migrations/applied_migrations.js`,
        `module.exports = ${inspect(
          stripAppliedMigrations({ applied_migrations, responses }),
          {
            compact: false,
            depth: null
          }
        )}`
      );
    });
  } catch (err) {
    console.log(err);
    logger.error({ err });
  }
};

const stripAppliedMigrations = ({ applied_migrations, responses }) => {
  responses.forEach(migration => {
    logger.custom({
      template: "nails rollback => ",
      msg: `${migration} 🤓`,
      color: "warn"
    });
    delete applied_migrations[migration];
  });
  return applied_migrations;
};

const appliedMigrationsArray = root => {
  const applied_migrations = require(paths.migrations({
    root: root,
    file: "applied_migrations"
  }));

  const appliedMigrations = [];
  iterateFiles(`${root}/server/database/migrations`, (file, fnSplit) => {
    const migration = require(paths.migrations({ root, file }));
    if (applied_migrations[file]) {
      appliedMigrations.push({
        migration,
        file,
        key: migration.action,
        batch: applied_migrations[file].batch
      });
    }
  });

  return { appliedMigrations, applied_migrations };
};
