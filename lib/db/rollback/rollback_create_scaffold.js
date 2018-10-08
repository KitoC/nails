const { writeObjectToFile, shallowRemove } = require("../../utils");

const mongoose = require("mongoose");
const shell = require("shelljs");

module.exports = (migrationName, migration, originalSchema, rootPath) => {
  require("dotenv").config({ path: `${rootPath}/server/.env` });

  return new Promise(async (resolve, reject) => {
    mongoose.connect(
      process.env.DEVELOPMENT_DB,
      { useNewUrlParser: true }
    );
    const connection = mongoose.connection;

    await connection.on("open", async () => {
      const collectionList = await connection.db.listCollections().toArray();
      let modelExists = false;

      await collectionList.map(async (model, i) => {
        if (model.name === migration.model) {
          modelExists = true;
        }
      });
      if (modelExists) {
        await connection.db.dropCollection(
          migration.model,
          async (err, result) => {
            connection.close(() => {
              resolve(
                shallowRemove(
                  rootPath,
                  migration,
                  originalSchema,
                  migrationName
                )
              );
            });
          }
        );
      } else {
        connection.close(() => {
          resolve(
            shallowRemove(rootPath, migration, originalSchema, migrationName)
          );
        });
      }
    });
  });
};
