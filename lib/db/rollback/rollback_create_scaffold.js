const { shallowRemove, removeFile } = require("../../utils");

const mongoose = require("mongoose");

module.exports = (migrationName, migration, originalSchema, rootPath) => {
  console.log('Hit rollback action')
  await scrubDBModel(migrationName, migration, originalSchema, rootPath);
  await removeFile(`${rootPath}/server/routes/${migration.model}.js`)
  await removeFile(`${rootPath}/server/models/${migration.model}.js`)
};

const scrubDBModel = (migrationName, migration, originalSchema, rootPath) => {
  return new Promise(async (resolve, reject) => {
    require("dotenv").config({ path: `${rootPath}/server/.env` });
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
              resolve(console.log("DB scrubbed"));
            });
          }
        );
      } else {
        connection.close(() => {
          resolve(console.log("DB scrubbed"));
        });
      }
    });
  });
};
