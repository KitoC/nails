module.exports = (migration, schema, filename) => {
  if (migration.timestamps) {
    migration.columns = {
      ...migration.columns,
      created_at: "date",
      updated_at: "date"
    };
  }
  schema.models[migration.model] = migration.columns;
};
