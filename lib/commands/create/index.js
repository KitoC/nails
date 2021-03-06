const fs = require("fs");

const { logger, recursiveFileGenerator } = require("../../utils");
const serverGenerations = require("./generations.server");
const clientGenerations = require("./generations.client");

module.exports = (args, options) => {
  try {
    const root = `${process.cwd()}/${args.newProjectName}`;

    if (options.omit) {
      const omitMatch = options.omit === "client" || options.omit === "server";

      if (!omitMatch) {
        throw { code: "omit_no_match" };
      }
    }

    if (!fs.existsSync(root)) {
      options.verbose && logger.info({ msg: "generating root directory" });
      fs.mkdirSync(root);

      // const serverDirectory = root + "/server";
      logger.info({ msg: `generating directory: ${args.newProjectName}/` });

      const initialTemplateDir = __dirname + "/../../../templates/root";

      recursiveFileGenerator(initialTemplateDir, root, args, options);

      if (options.omit !== "server") {
        options.verbose && logger.info({ msg: "generating server directory" });
        serverGenerations(args, options, root);
      }
      if (options.omit !== "client") {
        options.verbose && logger.info({ msg: "generating client directory" });
        clientGenerations(args, options, root);
      }
    } else {
      logger.error({ code: "dir_exists" });
      process.exit(-1);
    }
  } catch (err) {
    logger.error(err);
  }
};
