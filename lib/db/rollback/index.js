const colors = require("../../colors");
const { inspect } = require("util");

const {
  executeFromRoot,
  writeFile,
  iterateFiles,
  infoLog,
  errorLog
} = require("../../utils");

module.exports = async (args, options, logger) => {
  try {
    executeFromRoot(rootPath => {
      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }
      console.log("\n");

      // const schemaPath = `${rootPath}/server/db/schema.js`;
      const appliedMigrations = appliedMigrationsToArray(rootPath);
      if (parseInt(steps) > appliedMigrations.length) {
        throw {
          message: `You have specified too many rollbacks. There are only ${colors.warn(
            appliedMigrations.length
          )} possible rollbacks to be run.`
        };
      }

      rollbackLoop(steps, rootPath);
    });
  } catch (err) {
    errorLog(err);
  }
};

const appliedMigrationsToArray = rootPath => {
  const { applied_migrations } = require(`${rootPath}/server/db/`);
  const appliedMigrations = [];
  iterateFiles(`${rootPath}/server/db/migrations`, (fn, fnSplit) => {
    if (applied_migrations[fn]) {
      appliedMigrations.push(fn);
    }
  });
  return appliedMigrations;
};

const rollbackLoop = async (steps, rootPath) => {
  // const migrationPath = `${rootPath}/server/db/migrations/`;

  let originalSchema = require(`${rootPath}/server/db`).schema;
  // console.log(originalSchema);
  const applied_migrations_array = appliedMigrationsToArray(rootPath);
  const { applied_migrations } = require(`${rootPath}/server/db/`);
  // console.log(applied_migrations);
  const migrationsRolledBack = [];

  for (let i = 0; i < steps; i++) {
    await rollbackFunc(
      applied_migrations_array,
      rootPath,
      originalSchema,
      applied_migrations
    );

    applied_migrations_array.pop();

    // originalSchema = rollback.originalSchema;

    // migrationsRolledBack.push(rollback.migrationName);
  }
  console.log(applied_migrations);
  // Writes to the model file e.g. "./models/posts.js"
  writeFile(
    `${rootPath}/server/db/migrations/applied_migrations.js`,
    `module.exports = ${inspect(applied_migrations, {
      compact: false,
      depth: null
    })}`
  );
  // console.log("rollback returned", rollback);
  // console.log(rollback);

  // await writeObjectToFile(`${rootPath}/server/db/schema.js`, originalSchema, {
  //   message: "All specified migrations have been rolled back. \n"
  // });
};

const rollbackFunc = async (
  applied_migrations_array,
  rootPath,
  originalSchema,
  applied_migrations
) => {
  const migrationName =
    applied_migrations_array[applied_migrations_array.length - 1];
  const migrationToRollback = require(`${rootPath}/server/db/migrations/${migrationName}`);
  console.log({
    model: migrationToRollback.model,
    action: migrationToRollback.action
  });
  infoLog({
    action: "migration rollback",
    message: migrationName
  });

  const rollbackAction = require("./rollback_switch")(migrationToRollback);

  await rollbackAction(
    migrationName,
    migrationToRollback,
    originalSchema,
    rootPath
  );

  delete applied_migrations[migrationName];

  return applied_migrations;

  // return { originalSchema: response, migrationName };
};
