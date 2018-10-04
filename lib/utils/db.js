const { deCapitalize } = require("./general");
// console.log();

const dataTypeChecker = type => {
  switch (type) {
    case "string":
      return true;

    case "longtext":
      return true;

    case "buffer":
      return true;

    case "boolean":
      return true;

    case "date":
      return true;

    case "number":
      return true;

    case "mixed":
      return true;

    case "objectid":
      return true;

    case "decimal":
      return true;

    case "array":
      return true;

    case "array=string":
      return true;

    case "array=number":
      return true;

    case "array=date":
      return true;

    case "array=buffer":
      return true;

    case "array=boolean":
      return true;

    case "array=mixed":
      return true;

    case "array=objectid":
      return true;

    case "array=array":
      return true;
  }
};

// force to snakeCase
const snakeCase = str => {
  return str.replace(/-/g, "_");
};

// format
const formatKey = key => {
  const formattedKey = snakeCase(deCapitalize(key));
  if (formattedKey.includes("_")) {
    return formattedKey.toLowerCase();
  }
  return formattedKey;
};

// NOTE: anything below is exported and used, anything above is utilized by the functions exported below

// Turns args.modelColumns into an actual javascript object.
module.exports = {
  objectify: modelColumns => {
    let passed = true;
    const modelObject = {};
    const wrongDataTypes = [];

    modelColumns.map(col => {
      const colName = formatKey(col.split(":")[0]);
      const colType = col.split(":")[1].toLowerCase();
      modelObject[colName] = colType;
    });

    for (let key in modelObject) {
      if (!dataTypeChecker(modelObject[key])) {
        passed = false;
        wrongDataTypes.push(modelObject[key]);
      }
    }
    if (passed) {
      return { passed, modelObject };
    }
    return { passed, wrongDataTypes };
  }
};
