const shell = require("shelljs");

module.exports = (migration, schema, filename, rootPath) => {
  if (migration.action === "CREATE_SCAFFOLD") {
    schema.endpoints.push(migration.model);
  }
  if (migration.timestamps) {
    migration.columns = {
      ...migration.columns,
      created_at: "date",
      updated_at: "date"
    };
  }

  const templatePath = `${__dirname}/../../../templates/scaffold/route.js`;

  shell.cp("-R", `${templatePath}`, `${rootPath}/server/routes`);

  shell.mv(
    "-f",
    `${rootPath}/server/routes/route.js`,
    `${rootPath}/server/routes/${migration.model}.js`
  );

  shell.sed(
    "-i",
    `\\[MODEL_NAME\\]`,
    migration.model,
    `${rootPath}/server/routes/${migration.model}.js`
  );

  schema.models[migration.model] = migration.columns;
};
