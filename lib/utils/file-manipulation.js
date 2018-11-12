const logger = require("./logger");
const { splitStr } = require("./formatters");
const fs = require("fs");

// Loops through files in migrations folder and returns their name and a split str version
const iterateFiles = (path, callback) => {
  require("fs")
    .readdirSync(path)
    .forEach(file => {
      return callback(file, splitStr(file, "_"));
    });
};

// writes a string or template to file
const writeFile = async (path, template) => {
  await fs.writeFile(path, template, err => {
    if (err) {
      throw err;
    }
  });
};

// const databaseTypeConfigs = dbType => {
//   switch (dbType) {
//     case "postgres":
//       return `
//       adaptor: "postgres",
//       user: process.env.DBUSER,
//       password: process.env.DBPASSWORD,
//       port: 5432,
//       host: "localhost"
//       `;

//     default:
//       return `
//       //
//       adaptor: "sqlite3",
//       path: "/db/databases/"
//       //   user: process.env.DBUSER,
//       //   password: process.env.DBPASSWORD
//       //   port: 5432
//       //   host: "localhost"
//       `;
//   }
// };

const variableSwitch = (variable, args, options) => {
  switch (variable) {
    case "[[PROJECT_NAME]]":
      return args.newProjectName;
  }
};

// loops through template variables and replaces any variables found in the template file.
const replaceTemplateVariables = (
  templateFile,
  { args, options, provided }
) => {
  return new Promise(async (resolve, reject) => {
    // TODO: abstract these perhaps?
    const variables = ["[[PROJECT_NAME]]"];

    const varRegex = [/\[\[(PROJECT_NAME?)\]\]/g];

    let fileVarsReplaced = templateFile;

    if (provided) {
      fileVarsReplaced = await fileVarsReplaced.replace(
        provided.regex,
        provided.value
      );
      console.log(fileVarsReplaced);
      resolve(fileVarsReplaced);
      return;
    }
    await variables.map((variable, i) => {
      fileVarsReplaced = fileVarsReplaced.replace(
        varRegex[i],
        variableSwitch(variable, args, options)
      );
    });

    resolve(fileVarsReplaced);
  });
};

const fileIsImage = file => {
  if (file.includes(".png")) {
    return true;
  }
  if (file.includes(".jpg")) {
    return true;
  }
  return false;
};

// recursively generates files and directorys from the template directory to the target directory
const recursiveFileGenerator = async (
  parentTemplateDirectory,
  parentDirectory,
  args,
  options
) => {
  await iterateFiles(parentTemplateDirectory, async file => {
    // TODO: create a check other file types
    if (file.includes(".")) {
      const templateFile = await fs.readFileSync(
        `${parentTemplateDirectory}/${file}`,
        "utf8"
      );
      if (fileIsImage(file)) {
        const inStr = fs.createReadStream(`${parentTemplateDirectory}/${file}`);
        const outStr = fs.createWriteStream(`${parentDirectory}/${file}`);

        inStr.pipe(outStr);
      } else {
        replaceTemplateVariables(templateFile, { args, options }).then(
          fileVarsReplaced => {
            logger.info({ msg: ` file: ${parentDirectory}/${file}` });
            writeFile(`${parentDirectory}/${file}`, fileVarsReplaced);
          }
        );
      }
    } else {
      logger.info({ msg: `dir:  ${parentDirectory}/${file}` });

      await fs.mkdirSync(`${parentDirectory}/${file}`);

      await recursiveFileGenerator(
        `${parentTemplateDirectory}/${file}`,
        `${parentDirectory}/${file}`,
        args,
        options
      );
    }
  });
};

module.exports = {
  iterateFiles,
  variableSwitch,
  replaceTemplateVariables,
  fileIsImage,
  recursiveFileGenerator,
  writeFile
};
