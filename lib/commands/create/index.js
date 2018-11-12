const prompt = require("prompt");
const shell = require("shelljs");
const fs = require("fs");
const colors = require("colors/safe");

const { logger } = require("../../utils");
const serverGenerations = require("./generations.server");
const clientGenerations = require("./generations.client");

// Set prompt as green and use the "Replace" text
prompt.message = colors.green("Replace");

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
    console.log(err);
    logger.error(err);
  }
};
