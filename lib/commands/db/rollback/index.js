const colors = require("../../../utils/colors");
const { inspect } = require("util");
const Hammered = require("hammered-orm");

const {
  executeFromRoot,
  writeFile,
  iterateFiles,
  infoLog,
  logger
} = require("../../../utils");

module.exports = async (args, options) => {
  try {
    executeFromRoot(rootPath => {
      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }

      const appliedMigrations = appliedMigrationsToArray(rootPath);

      if (parseInt(steps) > appliedMigrations.simple.length) {
        throw {
          message: `You have specified too many rollbacks. There are only ${colors.warn(
            appliedMigrations.simple.length
          )} possible rollbacks to be run.`
        };
      }
      rollbackLoop(steps, rootPath, appliedMigrations);
    });
  } catch (err) {
    logger.error({ err });
  }
};

const appliedMigrationsToArray = rootPath => {
  const applied_migrations = require(`${rootPath}/server/database/migrations/applied_migrations`);

  const appliedMigrations = [];
  iterateFiles(`${rootPath}/server/database/migrations`, (fn, fnSplit) => {
    if (applied_migrations[fn]) {
      appliedMigrations.push(fn);
    }
  });

  return { simple: appliedMigrations, batched: applied_migrations };
};

const rollbackLoop = async (steps, rootPath, appliedMigrations) => {
  const { database } = require(`${rootPath}/server/config.js`);

  database.development.path = `/server${database.development.path}`;

  const db = new Hammered({ config: database.development });

  await db.connect(() => {});

  if (database.development.adaptor === "sqlite3") {
    db.serialize();
  }

  const migrationsToRollback = appliedMigrations.simple.slice(
    Math.max(appliedMigrations.simple.length - steps)
  );

  Promise.all(
    migrationsToRollback.map(migration => rollbackFunc(migration, db, rootPath))
  ).then(results => {
    results.map(migration => {
      delete appliedMigrations.batched[migration];
    });

    writeFile(
      `${rootPath}/server/database/migrations/applied_migrations.js`,
      `module.exports = ${inspect(appliedMigrations.batched, {
        compact: false,
        depth: null
      })}`
    );
  });
};

const rollbackFunc = (migr, database, rootPath) => {
  return new Promise(async (resolve, reject) => {
    const migration = require(`${rootPath}/server/database/migrations/${migr}`);
    // rollbackFunc(migration, db, rootPath);
    const rollback = require("./rollback_switch")(migration);
    await rollback(rootPath, database, migration)
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
