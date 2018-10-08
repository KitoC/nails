const colors = require("../../colors");

const {
  executeFromRoot,
  writeObjectToFile,
  iterateFiles,
  infoLog,
  errorLog
} = require("../../utils");

const appliedMigrationsToArray = (rootPath, applied_migrations) => {
  const appliedMigrations = [];
  iterateFiles(`${rootPath}/server/db/migrations`, (fn, fnSplit) => {
    if (applied_migrations[fn]) {
      appliedMigrations.push(fn);
    }
  });
  return appliedMigrations;
};

const rollbackLoop = async (steps, schemaPath, rootPath) => {
  let originalSchema = require(schemaPath);
  const applied_migrations = appliedMigrationsToArray(
    rootPath,
    originalSchema.applied_migrations
  );
  // console.log(applied_migrations);
  const migrationsRolledBack = [];

  for (let i = 0; i < steps; i++) {
    const rollback = await rollbackFunc(
      applied_migrations,
      rootPath,
      originalSchema
    );
    originalSchema = rollback.originalSchema;
    applied_migrations.pop();
    migrationsRolledBack.push(rollback.migrationName);
  }

  await writeObjectToFile(`${rootPath}/server/db/schema.js`, originalSchema, {
    message: "All specified migrations have been rolled back. \n"
  });
};

const rollbackFunc = async (applied_migrations, rootPath, originalSchema) => {
  const migrationName = applied_migrations[applied_migrations.length - 1];
  console.log(migrationName);
  const migrationToRollback = require(`${rootPath}/server/db/migrations/${migrationName}`);
  infoLog({
    action: "migration rollback",
    message: migrationName
  });

  const rollbackAction = require("./rollback_switch")(migrationToRollback);

  const response = await rollbackAction(
    migrationName,
    migrationToRollback,
    originalSchema,
    rootPath
  );

  return { originalSchema: response, migrationName };
};

module.exports = async (args, options, logger) => {
  try {
    executeFromRoot(rootPath => {
      let steps;
      steps = 1;
      if (args.type[0]) {
        steps = args.type[0].split("step=")[1];
      }
      console.log("\n");

      const schemaPath = `${rootPath}/server/db/schema.js`;
      const appliedMigrations = appliedMigrationsToArray(
        rootPath,
        require(schemaPath).applied_migrations
      );
      if (parseInt(steps) > appliedMigrations.length) {
        throw {
          message: `You have specified too many rollbacks. There are only ${colors.warn(
            appliedMigrations.length
          )} possible rollbacks to be run.`
        };
      }

      rollbackLoop(steps, schemaPath, rootPath);
    });
  } catch (err) {
    errorLog(err);
  }
};
