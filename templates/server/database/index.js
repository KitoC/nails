const fs = require("fs");
const { database } = require("../config");
const Hammer = require("hammered-orm");
const logger = require("../utils/logger");

const db = new Hammer({
  config: database.development
});

const models = {};
const schema = {};

fs.readdirSync(__dirname + "/models/").map(file => {
  const { model, columns } = require(`./models/${file}`);
  models[model] = db.createOrm(model);
  schema[model] = columns;
});

db.connect(() => {
  logger.success({
    code: "connected_to_database",
    info: database.development.database
  });
  db.serialize();
});

module.exports = { ...models, schema };
