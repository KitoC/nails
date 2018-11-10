const prompt = require("prompt");
const shell = require("shelljs");
const fs = require("fs");

const { logger, writeFile, iterateFiles } = require("../../utils");

module.exports = async (args, options, root) => {
  try {
    const serverDirectory = root + "/server";
    logger.info({ msg: "generating directory: server/" });
    await fs.mkdirSync(serverDirectory);

    // server/ (root) files
    const rootTemplateFilesPath =
      __dirname + "/../../../templates/server/root-files";
    await iterateFiles(rootTemplateFilesPath, async file => {
      let requireName = file;
      let fileName = file;
      if (file === "package.js") {
        fileName = `${file.split(".js")[0]}.json`;
      }
      logger.info({ msg: "generating file: server/" + fileName });
      await writeFile(
        `${serverDirectory}/${fileName}`,
        require(`${rootTemplateFilesPath}/${requireName}`)({
          projectName: args.projectName,
          adaptor: options.db
        })
      );
    });

    // server/database/ files
    logger.info({ msg: "generating directory: database/" });
    const databaseDirectory = serverDirectory + "/database";
    await fs.mkdirSync(databaseDirectory);

    const databaseTemplateFilesPath =
      __dirname + "/../../../templates/server/database";
    await iterateFiles(databaseTemplateFilesPath, async file => {
      let requireName = file;
      let fileName = file;

      if (file.indexOf(".js") !== -1) {
        logger.info({ msg: "generating file: database/" + fileName });
        await writeFile(
          `${databaseDirectory}/${fileName}`,
          require(`${databaseTemplateFilesPath}/${requireName}`)({
            projectName: args.projectName,
            adaptor: options.db
          })
        );
      } else {
        logger.info({ msg: "generating directory: database/" + file });
        await fs.mkdirSync(`${databaseDirectory}/${file}`);
      }
    });

    // creates applied_migrations in server/database/migrations/
    logger.info({ msg: "generating file: migrations/applied_migrations.js" });
    await writeFile(
      `${databaseDirectory}/migrations/applied_migrations.js`,
      "module.exports = {}"
    );

    // server/middleware/ files
    logger.info({ msg: "generating directory: middleware/" });
    await fs.mkdirSync(`${serverDirectory}/middleware`);

    logger.info({ msg: "generating file: middleware/index.js" });
    await writeFile(
      `${serverDirectory}/middleware/index.js`,
      "module.exports = {}"
    );

    // server/routes/ files
    const routesTemplateFilesPath =
      __dirname + "/../../../templates/server/routes";
    await fs.mkdirSync(`${serverDirectory}/routes`);

    logger.info({ msg: "generating file: routes/index.js" });
    await writeFile(
      `${serverDirectory}/routes/index.js`,
      require(`${routesTemplateFilesPath}/index.js`)()
    );

    // server/sockets/ files
    const socketsTemplateFilesPath =
      __dirname + "/../../../templates/server/sockets";
    await fs.mkdirSync(`${serverDirectory}/sockets`);

    logger.info({ msg: "generating file: sockets/index.js" });
    await writeFile(
      `${serverDirectory}/sockets/index.js`,
      require(`${socketsTemplateFilesPath}/index.js`)()
    );

    logger.info({ msg: "generating file: sockets/db-schema.js" });
    await writeFile(
      `${serverDirectory}/sockets/db-schema.js`,
      require(`${socketsTemplateFilesPath}/db-schema.js`)()
    );

    // server/utils/ files
    logger.info({ msg: "generating directory: utils/" });
    const utilsDirectory = serverDirectory + "/utils";
    await fs.mkdirSync(utilsDirectory);

    const utilsTemplateFilesPath =
      __dirname + "/../../../templates/server/utils";

    await iterateFiles(utilsTemplateFilesPath, async file => {
      let requireName = file;
      let fileName = file;

      if (file.indexOf(".js") !== -1) {
        logger.info({ msg: "generating file: utils/" + fileName });
        await writeFile(
          `${utilsDirectory}/${fileName}`,
          require(`${utilsTemplateFilesPath}/${requireName}`)()
        );
      } else {
        logger.info({ msg: "generating directory: utils/" + file });
        await fs.mkdirSync(`${utilsDirectory}/${file}`);
      }
    });

    await iterateFiles(utilsTemplateFilesPath + "/logger", async file => {
      let requireName = file;
      let fileName = file;

      logger.info({ msg: "generating file: utils/logger" + fileName });
      await writeFile(
        `${utilsDirectory}/logger/${fileName}`,
        require(`${utilsTemplateFilesPath}/logger/${requireName}`)()
      );
    });
  } catch (err) {
    logger.error({ err });
  }
};
