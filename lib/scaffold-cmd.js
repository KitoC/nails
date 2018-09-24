
const shell = require("shelljs");
const colors = require("./colors");
const fs = require("fs");
const pluralize = require('pluralize')
const { readWriteToJSON, formatModelString, capitalize, objectify, executeFromRoot } = require("./helpers");

let localPath;
// Scaffold template paths
const modelTemplate = `${__dirname}/../templates/scaffold/model.js`;


const scaffoldModel = (args, options, modelNamePluralized) => {

  const modelDestination = `${localPath}/server/db/models`;
 


  shell.cp("-R", `${modelTemplate}`, modelDestination);

  shell.mv(`${modelDestination}/model.js`, `${modelDestination}/${modelNamePluralized}.js`)
  shell.sed(
    "-i",
    `\\[MODEL_NAME\\]`,
    capitalize(modelNamePluralized),
    `${modelDestination}/${modelNamePluralized}.js`
  );
  shell.sed(
    "-i",
    `\\[MONGOOSE_ARGS\\]`,
    `"${capitalize(modelNamePluralized)}", ${capitalize(modelNamePluralized)}`,
    `${modelDestination}/${modelNamePluralized}.js`
  );
  shell.sed(
    "-i",
    `\\[MODEL_OBJECT\\]`,
    `{${formatModelString(args.modelColumns, true)},
      updated: { type: Date, default: Date.now },
      created: { type: Date, default: Date.now }\n}`,
    `${modelDestination}/${modelNamePluralized}.js`
  );
}

const scaffoldSchema = (args, options, modelNamePluralized) => {
  readWriteToJSON(`${localPath}/server/db/schema.json`, (obj) => {
    obj.endpoints.push(modelNamePluralized.toLowerCase())
    obj.schema[modelNamePluralized.toLowerCase()] = objectify(args.modelColumns)
    return obj
  })

  readWriteToJSON(`${localPath}/client/src/config/schema.json`, (obj) => {
    obj.endpoints.push(modelNamePluralized.toLowerCase())
    obj.schema[modelNamePluralized.toLowerCase()] = objectify(args.modelColumns)
    return obj
  })
}

module.exports = (args, options, logger) => {
  const modelNamePluralized = pluralize(args.modelName)
  
  //   const newModel = formatSchema(args.modelColumns);
  try {
    executeFromRoot((root) => {
      localPath = root
      console.log(root)
      console.log(process.cwd())
      if (!fs.existsSync(`${localPath}/server/db/models/${modelNamePluralized}.js`)) {
        scaffoldModel(args, options, modelNamePluralized)
        scaffoldSchema(args, options, modelNamePluralized)
        console.log(colors.green(`${capitalize(modelNamePluralized)} successfully created.`))  
      } else {
        console.log(
            `${colors.error( "\nNails error! ")}${colors.warn('A model with that name already exists.')}`
        )
      }
    })
  } catch (err) {
    console.log(
      `${colors.error( "\nNails error! ")}${colors.info(err)}`
    )
  }
 
 
};
