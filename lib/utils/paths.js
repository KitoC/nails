// Paths in project directory
const routes = (root, file = "") => `${root}/server/routes/${file}`;
const models = (root, file = "") => `${root}/server/database/models/${file}`;
const migrations = (root, file = "") =>
  `${root}/server/database/migrations/${file}`;

module.exports = { migrations, models, routes };
