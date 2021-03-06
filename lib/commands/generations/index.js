const { errorLog } = require("../../utils");

module.exports = (args, options, logger) => {
  // $ rails generate model Product name:string description:text
  // $ rails generate migration AddPartNumberToProducts part_number:string
  // $ rails generate migration RemovePartNumberFromProducts part_number:string
  // $ rails generate migration AddDetailsToProducts part_number:string price:decimal
  console.log(process.cwd());
  switch (args.action) {
    case "model":
      return require("./model_or_scaffold")(args, options, logger);

    case "scaffold":
      return require("./model_or_scaffold")(args, options, logger);

    case "migration":
      return require("./migration")(args, options, logger);

    default:
      return errorLog({
        message: `That action (${
          args.action
        }) does not match any actions in Nails.`
      });
  }
};
