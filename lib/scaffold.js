const prompt = require("prompt");
const shell = require("shelljs");
const fs = require("fs");
const colors = require("./colors");
const { rootCheck, localPath, formatSchema } = require("./helpers.js");
const templatePath = `${__dirname}/../templates/scaffold/*`;

module.exports = (args, options, logger) => {
  const modelPath = `${localPath}/server/${args.modelName}`;
  //   const newModel = formatSchema(args.modelColumns);

  if (rootCheck()) {
    // console.log(createNewSchema(args.modelColumns), 2);
    shell.mkdir("-p", modelPath);
    shell.cp("-R", `${templatePath}`, modelPath);
    shell.sed(
      "-i",
      `\\[EXAMPLE_VARIABLE\\]`,
      args.modelName,
      `${modelPath}/TEST.js`
    );
    shell.sed(
      "-i",
      `\\[EXAMPLE_OBJECT\\]`,
      `{${formatSchema(args.modelColumns)} }`,
      `${modelPath}/TEST.js`
    );
  } else {
    logger.error(
      colors.warn(
        "\n This command must be executed in the root folder of your project."
      )
    );
  }
};
