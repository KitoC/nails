const colors = require("../../colors");
const migrationInfo = colors.migration("Nails migration => ");

module.exports = (migration, schema, filename) => {
  if (migration.action === "CREATE_SCAFFOLD") {
    schema.endpoints.push(migration.model);
  }
  if (migration.timestamps) {
    migration.columns = {
      ...migration.columns,
      created_at: "date",
      updated_at: "date"
    };
  }
  schema.models[migration.model] = migration.columns;
  console.log(migrationInfo + `${filename} 🤓`);
};
