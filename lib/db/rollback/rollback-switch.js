module.exports = (migration, originalSchema) => {
  switch (migration.action) {
    case "CREATE_SCAFFOLD":
      return require("./rollback_create_scaffold")(migration, originalSchema);

    case "CREATE_MODEL":
      return require("./rollback_create_scaffold")(migration, originalSchema);

    default:
      return console.log(
        "That action hasnt't been setuop yet => " + migration.action
      );
  }
};
