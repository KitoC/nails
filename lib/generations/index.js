module.exports = (args, options, logger) => {
  // $ rails generate model Product name:string description:text
  // $ rails generate migration AddPartNumberToProducts part_number:string
  // $ rails generate migration RemovePartNumberFromProducts part_number:string
  // $ rails generate migration AddDetailsToProducts part_number:string price:decimal
  switch (args.action) {
    case "model":
      //   console.log("model", args);
      return require("./model_or_scaffold")(args, options, logger);

    case "scaffold":
      //   console.log("model", args);
      return require("./model_or_scaffold")(args, options, logger);

    case "migration":
      return require("./migration")(args);

    default:
      return console.warn(
        `That action (${args.action}) does not match any actions in Nails.`
      );
  }
};