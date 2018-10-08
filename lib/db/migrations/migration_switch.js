module.exports = (migration, schema, filename, rootPath, batchDate) => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      schema.applied_migrations[filename] = { batch: batchDate };
      return require("./create_scaffold")(
        migration,
        schema,
        filename,
        rootPath
      );

    case "CREATE_MODEL":
      schema.applied_migrations[filename] = { batch: batchDate };
      return require("./create_model")(migration, schema, filename, rootPath);
  }
};
