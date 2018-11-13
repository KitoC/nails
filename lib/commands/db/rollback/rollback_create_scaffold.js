const { logger, removeFiles } = require("../../../utils");

module.exports = (rootPath, database, migration) => {
  // await scrubDBModel(migrationName, migration, originalSchema, rootPath);
  return new Promise(async (resolve, reject) => {
    await database.dropTable(migration.model);

    const removeFilesArray = [
      `${rootPath}/server/database/schema/${migration.model}.js`,
      `${rootPath}/server/routes/${migration.model}.js`
    ];

    await removeFiles(removeFilesArray)
      .then(res => {
        resolve();
      })
      .catch(err => {
        logger.error(err);
        reject();
        return;
      });
  });
};

// const scrubDBModel = (migrationName, migration, originalSchema, rootPath) => {
//   return new Promise(async (resolve, reject) => {
//     require("dotenv").config({ path: `${rootPath}/server/.env` });
//     mongoose.connect(
//       process.env.DEVELOPMENT_DB,
//       { useNewUrlParser: true }
//     );

//     const connection = mongoose.connection;

//     await connection.on("open", async () => {
//       const collectionList = await connection.db.listCollections().toArray();
//       let modelExists = false;

//       await collectionList.map(async (model, i) => {
//         if (model.name === migration.model) {
//           modelExists = true;
//         }
//       });

//       if (modelExists) {
//         await connection.db.dropCollection(
//           migration.model,
//           async (err, result) => {
//             connection.close(() => {
//               resolve(console.log("DB scrubbed"));
//             });
//           }
//         );
//       } else {
//         connection.close(() => {
//           resolve(console.log("DB scrubbed"));
//         });
//       }
//     });
//   });
// };
