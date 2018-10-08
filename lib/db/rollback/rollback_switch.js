module.exports = migration => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      // console.log("hit create_scaffold switch");
      return require("./rollback_create_scaffold");

    case "CREATE_MODEL":
      // console.log("hit create_model switch");
      return require("./rollback_create_model");

    default:
      return console.log(
        "That action hasnt't been setup yet => " + migration.action
      );
  }
};
