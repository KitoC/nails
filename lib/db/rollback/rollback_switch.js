module.exports = migration => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      console.log("hit CREATE_SCAFFOLD switch");
      return require("./rollback_create_scaffold");

    case "CREATE_MODEL":
      console.log("hit CREATE_MODEL switch");
      return require("./rollback_create_model");

    case "ADD_COLUMNS":
      console.log("hit ADD_COLUMNS switch");
      return require("./rollback_add_columns");

    default:
      return console.log(
        "That action hasnt't been setup yet => " + migration.action
      );
  }
};
