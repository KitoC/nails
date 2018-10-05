const fs = require("fs");
const shell = require("shelljs");
const moment = require("moment");
const pluralize = require("pluralize");
const colors = require("../colors");
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");

// ensures that the callback passed in is executed in the root dir of project.
const executeFromRoot = callback => {
  let condition = true;
  while (condition) {
    const localPath = process.cwd();
    const pkgCheck = fs.existsSync(`${localPath}/package.json`);
    if (pkgCheck) {
      const pkg = require(`${localPath}/package.json`);

      if (pkg.nails) {
        shell.cd("");
        callback(localPath);
        condition = false;
      }
      shell.cd("..");
    } else if (!pkgCheck || localPath === "/") {
      console.log(
        error +
          "You must be inside the directoy of you nails project to perform that action."
      );
      condition = false;
    }
  }
};

// reads JSON file and writes whatever is returned from callback back into same file.
const readWriteToJSON = (path, callback) => {
  fs.readFile(path, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err, "\nJSON read error path: ", path);
    } else {
      // obj = JSON.parse(data); //now it an object

      // json = JSON.stringify(callback(obj)); //convert it back to json
      const newObj = callback(require(path));
      fs.writeFile(
        path,
        newObj,
        "utf8",
        (callback = err => {
          if (err) {
            console.log(err, "\nJSON read error path: ", path);
          }
          console.log("readWriteToJSON was successful");
        })
      ); // write it back
    }
  });
};

// Capitalizes first letter of a string
const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Capitalizes first letter of a string
const deCapitalize = str => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

// Not sure if this is needed? formats args.modelColumns into a JSON template literal string.
// const formatSchemaJSON = arr => {
//   return arr.map(col => {
//     const colName = col.split(":")[0];
//     const colType = col.split(":")[1];
//     return ` "${colName}": "${colType.toLowerCase()}"`;
//   });
// };

const fileNamify = ({ action, type }) => {
  switch (action) {
    case "model":
      return `${moment().format("YYYYMMDDHHmmss")}_create_${pluralize(type)}`;

    case "scaffold":
      return `${moment().format("YYYYMMDDHHmmss")}_create_${pluralize(type)}`;
  }
};

const splitStr = (str, params) => {
  return str.split(params);
};

// Loops through files in migrations folder and returns their name and a split str version
const iterateFiles = (path, callback) => {
  require("fs")
    .readdirSync(path)
    .forEach(file => {
      callback(file, splitStr(file, "_"));
    });
};

module.exports = {
  capitalize,
  deCapitalize,
  readWriteToJSON,
  executeFromRoot,
  fileNamify,
  iterateFiles
};
