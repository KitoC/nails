const fs = require("fs");
const { paths } = require("../../paths");

const removeColumns = require("./remove-columns");
const addColumns = require("./add-columns");

const actionValidations = {
  REMOVE_COLUMNS: removeColumns,
  ADD_COLUMNS: addColumns
};

const migrations = ({ root, action, modelName, columns }) => {
  const modelSchema = {
    addedColumns: [],
    removedColumns: [],
    existingTables: []
  };

  const migrationPath = paths.migrations({ root });

  fs.readdirSync(migrationPath).forEach(file => {
    const migration = require(`${migrationPath}/${file}`);

    if (
      !modelSchema.existingTables.includes(migration.model) &&
      file !== "applied_migrations.js"
    ) {
      modelSchema.existingTables.push(migration.model);
    }

    if (file !== "applied_migrations.js" && modelName === migration.model) {
      const migrationColumns = Object.keys(migration.columns);

      // adds model to modelSchema
      if (
        migration.action === "CREATE_SCAFFOLD" ||
        (migration.action === "CREATE_MODEL" && !modelSchema[migration.model])
      ) {
        modelSchema[migration.model] = migration.columns;
      }

      // adds columns to modelSchema model
      if (migration.action === "ADD_COLUMNS") {
        modelSchema.addedColumns = [
          ...modelSchema.addedColumns,
          ...migrationColumns
        ];

        modelSchema[migration.model] = {
          ...modelSchema[migration.model],
          ...migration.columns
        };
      }

      // removes columns to modelSchema model
      if (migration.action === "REMOVE_COLUMNS") {
        modelSchema.removedColumns = [
          ...modelSchema.removedColumns,
          ...migrationColumns
        ];

        migrationColumns.forEach(
          column => delete modelSchema[migration.model][column]
        );
      }
    }
  });

  return actionValidations[action]({
    modelSchema,
    modelName,
    columns,
    action
  });
};

module.exports = migrations;
