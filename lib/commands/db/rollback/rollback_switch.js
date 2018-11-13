module.exports = migration => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      return require("./rollback_create_scaffold");

    case "CREATE_MODEL":
      return require("./rollback_create_model");

    case "ADD_COLUMNS":
      return require("./rollback_add_columns");

    default:
      return console.log(
        "That action hasnt't been setup yet => " + migration.action
      );
  }
};
