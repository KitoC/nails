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
  const migrationPath = paths.migrations({ root });

  fs.readdirSync(migrationPath).forEach(file => {
    if (file !== "applied_migrations.js") {
      const migration = require(`${migrationPath}/${file}`);

      if (migration.model === newModelName) {
        modelExists = true;
        console.log(actionChecker(migration, action));
        // console.log(newModelColumns.modelObject);

        console.log(migration.action);
        for (let key in newModelColumns.modelObject) {
          if (action === migration.action) {
            if (migration.columns[key]) {
              columnsExist.push(key);
            }
            if (!migration.columns[key]) {
              invalidColumns.push(key);
            }
          }

          if (action !== migration.action) {
          }
        }
      }
    }
  });

  console.log({ columnsExist, invalidColumns });
  return {
    columnsExist,
    invalidColumns,
    modelExists
  };
};

module.exports = {
  migrationValidator
};
