module.exports = action => {
  switch (action) {
    case "CREATE_SCAFFOLD":
      return require("./create_scaffold");

    case "CREATE_MODEL":
      return require("./create_model");

    case "ADD_COLUMNS":
      return require("./add_columns");
  }
};
