const fs = require("fs");
const { paths } = require("./paths");

const actionChecker = (migration, action) => {
  if (migration.action === action) {
    return true;
  }

  if (
    action === "ADD_COLUMNS" &&
    (migration.action === "CREATE_SCAFFOLD" ||
      migration.action === "CREATE_MODEL")
  ) {
    return true;
  }
  return false;
};

const migrationValidator = ({
  root,
  action,
  newModelName,
  newModelColumns
}) => {
  const columnsExist = [];
  const invalidColumns = [];
  let modelExists = false;
  let nullReferences = [];
  const migrationPath = paths.migrations({ root });

  fs.readdirSync(migrationPath).forEach(file => {
    if (file !== "applied_migrations.js") {
      const migration = require(`${migrationPath}/${file}`);

      if (newModelColumns.hasForeignKeys.length > 0) {
        for (let reference of newModelColumns.hasForeignKeys)
          if (
            reference !== migration.model &&
            !nullReferences.includes(reference)
          ) {
            nullReferences.push(reference);
          } else {
          }
      }

      if (migration.model === newModelName) {
        modelExists = true;

        for (let key in newModelColumns.modelObject) {
          if (action === migration.action) {
            if (migration.columns[key]) {
              // Use for checking if columns already exist on a table when attempting to add new columns to a table.
              columnsExist.push(key);
            }
            if (!migration.columns[key]) {
              // Used for when attempting to create a migration that removes columns from a table when those columns don't exist on that table.
              invalidColumns.push(key);
            }
          }

          if (action !== migration.action) {
          }
        }
      }
    }
  });

  return {
    columnsExist,
    invalidColumns,
    modelExists,
    nullReferences
  };
};

module.exports = {
  migrationValidator
};
