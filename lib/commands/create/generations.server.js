const prompt = require("prompt");
const shell = require("shelljs");
const fs = require("fs");

const { logger, recursiveFileGenerator } = require("../../utils");

module.exports = async (args, options, root) => {
  try {
    const serverDirectory = root + "/server";
    logger.info({ msg: "generating directory: server/" });

    await fs.mkdirSync(serverDirectory);

    const initialTemplateDir = __dirname + "/../../../templates/server";

    await recursiveFileGenerator(
      initialTemplateDir,
      serverDirectory,
      args,
      options
    );
  } catch (err) {
    logger.error({ err });
  }
};
