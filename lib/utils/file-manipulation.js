const logger = require("./logger");
const { splitStr, capitalize } = require("./formatters");
const paths = require("./paths");
const fs = require("fs");
const util = require("util");
const templates = require("./templates");

// Loops through files in migrations folder and returns their name and a split str version
const iterateFiles = (path, callback) => {
  require("fs")
    .readdirSync(path)
    .forEach(file => {
      return callback(file, splitStr(file, "_"));
    });
};

// writes a string or template to file
const writeFile = (path, template) => {
  return new Promise(async (resolve, reject) => {
    await fs.writeFile(path, template, err => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(console.log("file has been written"));
    });
  });
};

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
      await provided.map(({ regex, value }) => {
        fileVarsReplaced = fileVarsReplaced.replace(regex, value);
      });
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
        if (file !== "place-holder.txt") {
          replaceTemplateVariables(templateFile, { args, options }).then(
            fileVarsReplaced => {
              logger.info({ msg: `file: ${parentDirectory}/${file}` });
              writeFile(`${parentDirectory}/${file}`, fileVarsReplaced);
            }
          );
        }
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

// remove file
const removeFile = (path, callback) => {
  return new Promise(async (resolve, reject) => {
    fs.unlink(path, err => {
      if (err) throw err;
      // Figure out how to get this to work
      if (callback) {
        resolve(callback);
      }
      resolve(console.log(`${path} successfully removed.`));
    });
    reject(false);
  });
};

// remove file
const removeFiles = (filePaths, callback) => {
  return new Promise(async (resolve, reject) => {
    const errors = [];
    await filePaths.map(path => {
      fs.unlink(path, err => {
        if (err) {
          errors.push(err);

          return;
        }
        // Figure out how to get this to work
      });
    });
    if (errors.length > 0) {
      console.log(errors);
      reject();
      return;
    } else {
      resolve({ msg: "all files removed" });
    }
  });
};

const modelFileGenerator = ({ model, columns, root, scaffold = false }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = `${model}.js`;
      const replaceModelName = {
        value: capitalize(model),
        regex: /\[\[(MODEL_NAME?)\]\]/g
      };
      let columnTemplate = ``;
      Object.keys(columns).map(
        (key, i) =>
          (columnTemplate += `\n    ${key}: ${util.inspect(columns[key], {
            compact: true
          })},`)
      );
      const replaceModelColumns = {
        value: `{${columnTemplate}\n  }`,
        regex: /\[\[(MODEL_COLUMNS?)\]\]/g
      };

      const replacedVarsModelTemplate = await replaceTemplateVariables(
        templates["model"],
        { provided: [replaceModelName, replaceModelColumns] }
      );
      await writeFile(paths.models(root, file), replacedVarsModelTemplate);

      if (scaffold) {
        const replacedVarsRoutesTemplate = await replaceTemplateVariables(
          templates["route"],
          { provided: [replaceModelName] }
        );
        await writeFile(paths.routes(root, file), replacedVarsRoutesTemplate);
      }
      resolve();
    } catch (err) {
      logger.error(err);
    }
  });
};

const migrationFileGenerator = ({ model, columns, root, scaffold = false }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = `${model}.js`;
      const replaceModelName = {
        value: capitalize(model),
        regex: /\[\[(MODEL_NAME?)\]\]/g
      };
      let columnTemplate = ``;
      Object.keys(columns).map(
        (key, i) =>
          (columnTemplate += `\n    ${key}: ${util.inspect(columns[key], {
            compact: true
          })},`)
      );
      const replaceModelColumns = {
        value: `{${columnTemplate}\n  }`,
        regex: /\[\[(MODEL_COLUMNS?)\]\]/g
      };

      const replacedVarsModelTemplate = await replaceTemplateVariables(
        templates["model"],
        { provided: [replaceModelName, replaceModelColumns] }
      );
      await writeFile(paths.models(root, file), replacedVarsModelTemplate);

      if (scaffold) {
        const replacedVarsRoutesTemplate = await replaceTemplateVariables(
          templates["route"],
          { provided: [replaceModelName] }
        );
        await writeFile(paths.routes(root, file), replacedVarsRoutesTemplate);
      }
      resolve();
    } catch (err) {
      logger.error(err);
    }
  });
};

module.exports = {
  iterateFiles,
  variableSwitch,
  replaceTemplateVariables,
  fileIsImage,
  recursiveFileGenerator,
  writeFile,
  removeFile,
  removeFiles,
  modelFileGenerator
};
