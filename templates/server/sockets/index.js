module.exports = new Promise(async (resolve, reject) => {
  const dbSchema = await require("./db-schema");

  resolve([dbSchema]);
});
