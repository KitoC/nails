module.exports = (migration, schema, filename) => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      schema.applied_migrations.push(filename);
      return require("./create_model_or_scaffold")(migration, schema, filename);

    case "CREATE_MODEL":
      schema.applied_migrations.push(filename);
      return require("./create_model_or_scaffold")(migration, schema, filename);
  }
};
