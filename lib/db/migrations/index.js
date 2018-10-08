const moment = require("moment");

const {
  executeFromRoot,
  iterateFiles,
  nailsSuccess,
  errorLog,
  infoLog,
  writeObjectToFile
} = require("../../utils");

let pendingMigrations = [];
let batchDate;

module.exports = () => {
  try {
    executeFromRoot(rootPath => {
      const schemaPath = `${rootPath}/server/db/schema.js`;
      const migrationPath = `${rootPath}/server/db/migrations/`;
      const schema = require(schemaPath);
      console.log(schema.applied_migrations);

      console.log("\n");

      batchDate = moment().format("YYYYMMDDHHmmss");

      iterateFiles(migrationPath, (filename, filenameSplit) => {
        const migration = require(migrationPath + filename);
        if (!schema.applied_migrations[filename]) {
          pendingMigrations.push(filename);
          require("./migration_switch")(
            migration,
            schema,
            filename,
            rootPath,
            batchDate
          );

          infoLog({
            action: "migration",
            message: `${filename} 🤓`
          });
        }
      });

      // console.log(pendingMigrations);
      if (pendingMigrations.length > 0) {
        console.log(schema.applied_migrations);
        writeObjectToFile(schemaPath, schema, {
          message: "All pending migrations have been run. \n"
        });
      } else {
        infoLog({
          action: "Nails migration",
          message: "There are no pending migrations."
        });
      }
    });
  } catch (err) {
    errorLog(err);
  }
};
