const applied_migrations = require("./migrations/applied_migrations");
const { database } = require("../config");
const Hammer = require("hammered-orm");
const logger = require("../utils/logger");

const schema = {
  endpoints: [],
  models: {}
};

const db = new Hammer({
  config: database.development
});

module.exports = new Promise(async (resolve, reject) => {
  await db.connect(() => {});
  db.serialize();
  logger.success({
    code: "connected_to_database",
    info: database.development.database
  });

  await require("fs")
    .readdirSync(__dirname + "/models")
    .forEach(file => {
      const model = require(`./models/${file}`);

      if (model.scaffold) {
        schema.endpoints.push(model.model_name);
      }

      schema.models[model.model_name] = model.columns;
    });

  const tables = {};

  await schema.endpoints.map(table => {
    tables[table] = db.createOrm(table);
  });

  resolve({ schema, applied_migrations, ...tables, database });
});
