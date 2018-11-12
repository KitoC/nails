const fs = require("fs");
const shell = require("shelljs");
const moment = require("moment");
const pluralize = require("pluralize");
const colors = require("./colors");
const util = require("util");

const logger = require("./logger");

const nailsSuccess = colors.success("\nNails success! ");
const nailsError = colors.error("\nNails error! ");
// ensures that the callback passed in is executed in the root dir of project.

// const executeFromRoot = callback => {
//   let condition = true;
//   while (condition) {
//     let localPath = process.cwd();
//     const pkgCheck = fs.existsSync(`${localPath}/package.json`);
//     if (pkgCheck) {
//       const pkg = require(`${localPath}/package.json`);

//       callback(localPath);
//       condition = false;
//       localPath = null;
//       return;
//     } else if (!pkgCheck || localPath === "/") {
//       if (localPath === "/") {
//         condition = false;
//         localPath = null;
//         return;
//       }
//       if (!pkgCheck) {
//         shell.cd("..");
//       }
//     }
//   }
// };

const executeFromRoot = callback => {
  let condition = true;
  while (condition) {
    const localPath = process.cwd();
    const pkgCheck = fs.existsSync(`${localPath}/package.json`);
    if (pkgCheck) {
      const pkg = require(`${localPath}/package.json`);

      console.log(pkgCheck, localPath);
      if (pkg.nails) {
        // shell.cd("");
        callback(localPath);
        condition = false;
      }
      shell.cd("..");
    } else if (!pkgCheck || localPath === "/") {
      console.log(
        nailsError +
          "You must be inside the directory of a nails project to perform that action."
      );
      condition = false;
    }
  }
};

// Capitalizes first letter of a string
const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Capitalizes first letter of a string
const deCapitalize = str => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const fileNamify = (action, type) => {
  switch (action) {
    case "model":
      return `${moment().format("YYYYMMDDHHmmss")}_create_${pluralize(type)}`;

    case "scaffold":
      return `${moment().format("YYYYMMDDHHmmss")}_create_${pluralize(type)}`;

    case "migration":
      return `${moment().format("YYYYMMDDHHmmss")}${type}.js`;
  }
};

const splitStr = (str, params) => {
  return str.split(params);
};

const splitCamelcaseString = str => {
  return str
    .replace(/([A-Z]+)/g, " $1")
    .split(" ")
    .map(s => s.toLowerCase());
};

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
const replaceTemplateVariables = (templateFile, filename, args, options) => {
  return new Promise(async (resolve, reject) => {
    // TODO: abstract these perhaps?
    const variables = ["[[PROJECT_NAME]]"];

    const varRegex = [/\[\[(PROJECT_NAME?)\]\]/g];

    let fileVarsReplaced = templateFile;

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
        replaceTemplateVariables(templateFile, file, args, options).then(
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

// Error logging
const errorLog = err => {
  let data = "";
  let message = err;
  if (err.message) {
    message = err.message;
  }
  if (err.data) {
    data = err.data;
    return console.log(
      nailsError + message,
      util.inspect(data, {
        compact: err.compact,
        depth: null,
        colors: true
      })
    );
  }
  if (err.message) {
    message = err.message;
  }
  return console.log(nailsError + message);
};

// Info logging
const infoLog = info => {
  let data = "";

  if (info.data) {
    data = info.data;
    return console.log(
      colors.info(`${info.action} => `) + info.message,
      util.inspect(data, {
        compact: false,
        depth: null,
        colors: true
      })
    );
  }
  return console.log(colors.info(`Nails ${info.action} => `) + info.message);
};

// Success logging
const successLog = success => {
  if (success.data) {
    data = success.data;
    return console.log(
      `${nailsSuccess} ${success.message} ${util.inspect(data, {
        compact: false,
        depth: null,
        colors: true
      })}`
    );
  }

  return console.log(`${nailsSuccess} ${success.message}`);
};

module.exports = {
  capitalize,
  deCapitalize,
  // readWriteToJSON,
  executeFromRoot,
  fileNamify,
  iterateFiles,
  nailsSuccess,
  nailsError,
  errorLog,
  infoLog,
  successLog,
  splitCamelcaseString,
  writeFile,
  recursiveFileGenerator
};
