const moment = require("moment");
const pluralize = require("pluralize");

// Capitalizes first letter of a string
const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Capitalizes first letter of a string
const deCapitalize = str => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const fileNamify = (action, type) => {
  switch (action) {
    case "model":
      if (type.includes(":")) {
        return {
          code: "no_model_name"
        };
      }
      return `${moment().format("YYYYMMDDHHmmss")}_create_${pluralize(
        type
      )}.js`;

    case "scaffold":
      if (type.includes(":")) {
        return {
          code: "no_model_name"
        };
      }
      return `${moment().format("YYYYMMDDHHmmss")}_create_${pluralize(
        type
      )}.js`;

    case "migration":
      return `${moment().format("YYYYMMDDHHmmss")}${type}.js`;
  }
};

const splitStr = (str, params) => {
  return str.split(params);
};

const splitCamelcaseString = str => {
  return str
    .replace(/([A-Z]+)/g, " $1")
    .split(" ")
    .map(s => s.toLowerCase());
};

module.exports = {
  capitalize,
  deCapitalize,
  fileNamify,
  splitStr,
  splitCamelcaseString
};
