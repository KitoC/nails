const { deCapitalize, nailsSuccess, successLog } = require("./general");
const fs = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shell = require("shelljs");
require("dotenv").config();
const util = require("util");

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

    default:
      return false;
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
    modelObject[colName] = { type: colType };
  });

  for (let key in modelObject) {
    if (!dataTypeChecker(modelObject[key].type)) {
      passed = false;
      wrongDataTypes.push({ column: key, type: modelObject[key].type });
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

// Confverts key values into the correct schema types for mongoose
const datafy = model => {
  const datafiedModel = model;
  for (let key in model) {
    datafiedModel[key].type = dataTypes(datafiedModel[key].type);
  }
  return datafiedModel;
};

// Writes an updated schema back into the schema file
const writeObjectToFile = (path, object, message) => {
  fs.writeFile(
    path,
    `module.exports = ${util.inspect(object, {
      compact: false,
      depth: null
    })}`,
    err => {
      if (err) {
        throw err;
      }
      if (message) {
        successLog(message);
      }
    }
  );
};

// Removes the columns or models specified in the migraion that is being rolled back
const shallowRemove = async (
  rootPath,
  migration,
  originalSchema,
  migrationName
) => {
  // fs.unlink("path/file.txt", err => {
  //   if (err) throw err;
  //   console.log("path/file.txt was deleted");
  // });

  // shell.rm("-f", `${rootPath}/server/routes/${migration.model}.js`);

  if (
    migration.action === "CREATE_SCAFFOLD" ||
    migration.action === "CREATE_MODEL"
  ) {
    delete originalSchema.models[migration.model];
  } else {
    for (let key in migration.columns) {
      if (originalSchema.models[migration.model][key]) {
        delete originalSchema.models[migration.model][key];
      }
    }
  }

  delete originalSchema.applied_migrations[migrationName];

  if (migration.action === "CREATE_SCAFFOLD") {
    originalSchema.endpoints.pop();
  }

  return originalSchema;
};

// remove file
const removeFile = (path, callback) => {
  return new Promise(asyn, (resolve, reject) => {
    fs.unlink(path, err => {
      if (err) throw err;
      // Figure out how to get this to work
      if (callback) {
        resolve(callback);
      }
      resolve(console.log(`${path} successfully removed.`));
    });
    reject(false);
  });
};

const modelExistsInDb = async (modelName, connection) => {
  return new Promise(async (resolve, reject) => {
    // connection.on("open", async () => {
    // const collectionList = await connection.db.listCollections().toArray();
    // let modelExists = false;
    // console.log(collectionList);

    connection.on("open", async () => {
      console.log("Mongoose connected to: " + process.env.DEVELOPMENT_DB);
      const collections = await connection.db.listCollections().toArray();
      console.log(collections);

      await collections.map(async (model, i) => {
        if (model.name === modelName) {
          // modelExists = true;

          connection.close(err => {
            if (err) {
              throw err;
            }
            resolve(true);
          });
        } else {
          connection.close(err => {
            if (err) {
              throw err;
            }
            resolve(false);
          });
        }
      });

      // console.log(modelExists);
    });

    // await collectionList.map(async (model, i) => {
    //   if (model.name === modelName) {
    //     modelExists = true;
    //     resolve(true);
    //   } else {
    //     resolve(false);
    //   }
    // });
    // });
  });
};

// Updates all documents in database for a particular model according to the updater passed in.
const updateDocuments = async (rootPath, updater, modelName) => {
  return new Promise(async (resolve, reject) => {
    const {
      model,
      columns
    } = require(`${rootPath}/server/db/models/${modelName}.js`);
    // console.log(modelName);
    // const mongoose = require("mongoose");
    // require("dotenv").config({ path: `${rootPath}/server/.env` });

    // mongoose.connect(
    //   process.env.DEVELOPMENT_DB,
    //   { useNewUrlParser: true }
    // );
    // mongoose.connection.on("error", err => {
    //   console.log(err);
    // });
    // // const Schema = mongoose.Schema;
    // const connection = mongoose.connection;

    // const modelExists = await modelExistsInDb(modelName, connection);
    // console.log(modelExists);

    if (modelExists) {
      console.log("before response", updater);

      // const datafiedColumns = datafy(JSON.parse(JSON.stringify(columns)));

      // const Model = new Schema(datafiedColumns);

      // const SchemaModel = mongoose.model(modelName, Model);
      // console.log(SchemaModel);

      // model.find().then(data => {
      //   console.log(data);
      // });

      // SchemaModel.updateMany(
      //   {},
      //   updater,
      //   {
      //     multi: true
      //   },
      //   (data, err) => {
      //     console.log(data);
      //     console.log(err);
      //     resolve();
      //   }
      // );

      // , (err, data) => {
      //   if (err) {
      //     throw err;
      //   }
      //   console.log("WOOO", data);
      //   connection.close(err => {
      //     if (err) {
      //       throw err;
      //     }
      //     resolve();
      //   });
      // }
    } else {
      console.log("in else");
      // connection.close(err => {
      //   if (err) {
      //     throw err;
      //   }
      resolve();
      // });
    }
    // const datafiedColumns = datafy(
    //   JSON.parse(JSON.stringify(targetModel.columns))
    // );
    // const Model = new Schema(datafiedColumns);

    // const SchemaModel = mongoose.model(model, Model);

    // if (modelExists) {

    //   } else {
    //     connection.close(err => {
    //       if (err) {
    //         throw err;
    //       }
    //       resolve();
    //     });
    //   }
  });
};

// Takes migration columns and converts them into an object to $unset them from the database
const unsetify = migration => {
  const unset = { $unset: {} };
  for (key in migration.columns) {
    unset.$unset[key] = "";
  }
  return unset;
};

module.exports = {
  mongooseDo,
  objectify,
  datafy,
  writeObjectToFile,
  shallowRemove,
  updateDocuments,
  unsetify,
  dataTypes,
  removeFile
};
