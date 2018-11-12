const fs = require("fs");
const shell = require("shelljs");

const colors = require("./colors");
const util = require("util");

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
  executeFromRoot,
  nailsSuccess,
  nailsError,
  errorLog,
  infoLog,
  successLog
};
