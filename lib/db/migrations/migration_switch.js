module.exports = (migration, schema, filename) => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      schema.migrations_already_run.push(filename);
      return require("./create_model_or_scaffold")(migration, schema, filename);

    case "CREATE_MODEL":
      schema.migrations_already_run.push(filename);
      return require("./create_model_or_scaffold")(migration, schema, filename);
  }
};
