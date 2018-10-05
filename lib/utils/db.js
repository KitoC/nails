const { deCapitalize } = require("./general");
require("dotenv").config();
// console.log();

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataTypes = type => {
  switch (type) {
    case "string":
      return String;

    case "longtext":
      return String;

    case "buffer":
      return Buffer;

    case "boolean":
      return Boolean;

    case "date":
      return { type: Date, default: Date.now };

    case "number":
      return Number;

    case "mixed":
      return Schema.Types.Mixed;

    case "objectid":
      return Schema.Types.ObjectId;

    case "decimal":
      return Schema.Types.Decimal128;

    case "array":
      return [];

    case "array=string":
      return [String];

    case "array=number":
      return [Number];

    case "array=date":
      return [Date];

    case "array=buffer":
      return [Buffer];

    case "array=boolean":
      return [Boolean];

    case "array=mixed":
      return [Schema.Types.Mixed];

    case "array=objectid":
      return [Schema.Types.ObjectId];

    case "array=array":
      return [[]];
  }
};

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
const objectify = modelColumns => {
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
};

// Creates a connection to mongoDB through mongoose to perform DB actions
const mongooseDo = (targetModel, callback) => {
  mongoose.connect(process.env.DEVELOPMENT_DB);
  const Schema = mongoose.Schema;
  var model = mongoose.model(
    targetModel.name,
    new Schema(datafy(targetModel.model))
  );
  callback(model, mongoose);
  mongoose.connection.close();
};

// Confverts key values into the correct shcmea types for mongoose
const datafy = model => {
  const datafiedModel = model;
  for (let key in model) {
    datafiedModel[key] = dataTypes(datafiedModel[key]);
  }
  return datafiedModel;
};

module.exports = { mongooseDo, objectify, datafy };
