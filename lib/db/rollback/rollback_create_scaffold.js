const colors = require("../../colors");
const { executeFromRoot, mongooseDo, datafy } = require("../../utils");
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");
require("dotenv").config();
const mongoose = require("mongoose");

module.exports = (migration, originalSchema) => {
  console.log(migration.model);
  delete originalSchema.models[migration.model];
  originalSchema.applied_migrations.pop();
  if (migration.action === "CREATE_SCAFFOLD") {
    originalSchema.endpoints.pop();
  }

  // console.log(originalSchema);
  return originalSchema;

  // const targetModel = originalSchema.models[migration.model];
  // // console.log(targetModel);
  // targetModel.name = migration.model;

  // mongoose.connect(process.env.DEVELOPMENT_DB);
  // // const db = mongoose.connection;

  // const connection = mongoose.connection;

  // connection.on("open", function() {
  //   connection.db.listCollections().toArray(function(err, names) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("models", names);
  //       if (names.includes(targetModel.name) === true) {
  //         console.log("Model exists");
  //         mongoose.connection.db.dropCollection(e.name);
  //       } else {
  //         console.log("model does not exist");
  //       }
  //     }

  //     connection.close();
  //   });
  // });
};
