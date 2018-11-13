const { capitalize, datafy } = require("../../lib/utils");
const { inspect } = require("util");

module.exports = ({ columns, name, scaffold }) => {
  return `
// "${capitalize(name)}" model
const columns = ${inspect(columns, {
    compact: false,
    depth: null
  })};

  module.exports = {
    scaffold: ${scaffold},
    model_name: "${capitalize(name)}",
    columns
  };

        `;
};
