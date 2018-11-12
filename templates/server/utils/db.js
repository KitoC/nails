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
      return Date;
    case "date.now":
      return Date.now;

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

// TODO: figure out how thes eother schema types work
// var schema = new Schema({
//   ofArrayOfNumbers: [[Number]],
//   nested: {
//     stuff: { type: String, lowercase: true, trim: true }
//   },
//   map: Map,
//   mapOfString: {
//     type: Map,
//     of: String
//   }
// });
// NOTE: anything below this comment is exported and will use the above functions/variables for their own purposes.

// datafy: this converts a models field datatype into the correct data types and formats formongoose
const datafy = model => {
  const datafiedModel = model;
  for (let key in model) {
    datafiedModel[key].type = dataTypes(datafiedModel[key].type);

    if (key === "created_at" || key === "updated_at") {
      datafiedModel[key].default = dataTypes(datafiedModel[key].default);
    }
  }
  return datafiedModel;
};

module.exports = {
  datafy
};
