const prompt = require("prompt");
const shell = require("shelljs");
const fs = require("fs");
const colors = require("colors/safe");

// Set prompt as green and use the "Replace" text
prompt.message = colors.green("Replace");

module.exports = (args, options, logger) => {
  // Setting up required variables and options
  const variant = options.variant || "default";
  const templatePath = `${__dirname}/../templates/${variant}`;
  const localPath = process.cwd();
  const newProject = args.newProjectName;

  // IF the template path exists then it will gfirst create a new directory specified by the user and then copy the designated template into the new directory. If no template has been specified then it will use the default template.
  if (fs.existsSync(templatePath)) {
    logger.info("Copying files...");
    shell.mkdir("-p", `${localPath}/${newProject}`);
    shell.cp("-R", `${templatePath}/*`, `${localPath}/${newProject}`);
    logger.info("The files have been copied!");
  } else {
    logger.error(`The requested template for ${args.template} wasn't found.`);
    process.exit(1);
  }

  const variables = require(`${templatePath}/_variables.js`);

  // Deletes the _variables.js file from the new created project.
  if (fs.existsSync(`${localPath}/${newProject}/_variables.js`)) {
    shell.rm(`${localPath}/${newProject}/_variables.js`);
  }

  logger.info("Please fill in the following details.");

  // Uses the variables file we created to prompt the user in order to replace the variables we have setup in the package.json
  prompt.start().get(variables, (err, result) => {
    // Replaces variable values in all files
    shell.ls("-Rl", ".").forEach(entry => {
      if (entry.isFile()) {
        console.log(result);
        variables.forEach(variable => {
          shell.sed(
            "-i",
            `\\[${variable.toUpperCase()}\\]`,
            result[variable],
            entry.name
          );
        });
      }
    });
  });
};
