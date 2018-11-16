const colors = require("../../../utils/colors");
const { inspect } = require("util");
const Hammered = require("hammered-orm");
const rollbackSwitch = require("./rollback_switch");
const {
  executeFromRoot,
  writeFile,
  iterateFiles,
  nailsPaths,
  logger
} = require("../../../utils");

module.exports = async (args, options) => {
  try {
    executeFromRoot(root => {
      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }

      const appliedMigrations = appliedMigrationsToArray(root);

      if (parseInt(steps) > appliedMigrations.simple.length) {
        throw {
          message: `You have specified too many rollbacks. There are only ${colors.warn(
            appliedMigrations.simple.length
          )} possible rollbacks to be run.`
        };
      }
      rollbackLoop(steps, root, appliedMigrations);
    });
  } catch (err) {
    logger.error({ err });
  }
};

const appliedMigrationsToArray = root => {
  const applied_migrations = require(nailsPaths({
    name: "migrations",
    root: root,
    file: "applied_migrations"
  }));

  const appliedMigrations = [];
  iterateFiles(`${root}/server/database/migrations`, (fn, fnSplit) => {
    if (applied_migrations[fn]) {
      appliedMigrations.push(fn);
    }
  });

  return { simple: appliedMigrations, batched: applied_migrations };
};

const rollbackLoop = async (steps, root, appliedMigrations) => {
  const config = require(`${root}/server/config.js`);
  const development = config.database.development;

  development.path = `/server${development.path}`;

  const database = new Hammered({ config: development });

  await database.connect(() => {});

  if (development.adaptor === "sqlite3") {
    database.serialize();
  }

  const migrationsToRollback = appliedMigrations.simple.slice(
    Math.max(appliedMigrations.simple.length - steps)
  );

  Promise.all(
    migrationsToRollback.map(migr => rollbackFunc(migr, database, root))
  ).then(results => {
    results.map(migration => {
      delete appliedMigrations.batched[migration];
    });

    writeFile(
      `${root}/server/database/migrations/applied_migrations.js`,
      `module.exports = ${inspect(appliedMigrations.batched, {
        compact: false,
        depth: null
      })}`
    );
  });
};

const rollbackFunc = (migr, database, root) => {
  return new Promise(async (resolve, reject) => {
    const migration = require(`${root}/server/database/migrations/${migr}`);
    // rollbackFunc(migration, database, root);
    // const rollback = require("./rollback_switch")(migration);
    await rollbackSwitch[migration.action]({ migration, root, database })
      .then(() => {
        logger.custom({
          template: "nails rollback => ",
          msg: `${migr} 🤓`,
          color: "warn"
        });
        resolve(migr);
      })
      .catch(err => {
        logger.error({ err });
      });
    // delete appliedMigrations.batched[migr];
  });
};
