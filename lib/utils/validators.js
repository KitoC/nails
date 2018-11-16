const fs = require("fs");
const { paths } = require("./paths");

const migrationValidator = ({ root, newModelName, newModelColumns }) => {
  const columnsExist = [];
  let modelExists = false;
  const migrationPath = paths.migrations({ root });

  fs.readdirSync(migrationPath).forEach(file => {
    if (file !== "applied_migrations.js") {
      const migration = require(`${migrationPath}/${file}`);
      if (migration.model === newModelName) {
        modelExists = true;

        for (let key in newModelColumns.modelObject) {
          if (migration.columns[key]) {
            columnsExist.push(key);
          }
        }
      }
    }
  });
  return {
    columnsExist,
    modelExists
  };
};

module.exports = {
  migrationValidator
};
