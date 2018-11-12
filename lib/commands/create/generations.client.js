const fs = require("fs");

const { logger, recursiveFileGenerator } = require("../../utils");

module.exports = async (args, options, root) => {
  try {
    const clientDirectory = root + "/client";

    logger.info({ msg: "generating directory: client/" });

    await fs.mkdirSync(clientDirectory);

    const initialTemplateDir = __dirname + "/../../../templates/client";

    await recursiveFileGenerator(
      initialTemplateDir,
      clientDirectory,
      args,
      options
    );
  } catch (err) {
    logger.error({ err });
  }
};
