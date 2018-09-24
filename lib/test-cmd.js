
const shell = require("shelljs");
const colors = require("./colors");
const fs = require("fs");
const { readWriteToJSON, formatObject, capitalize, objectify, executeFromRoot } = require("./helpers");

let localPath;
// Scaffold template paths
const modelTemplate = `${__dirname}/../templates/scaffold/model.js`;


const scaffoldModel = (args, options) => {

  const modelDestination = `${localPath}/server/db/models`;

  console.log(args,  `{${formatObject(args.modelColumns, true)}}
      updated: { type: Date, default: Date.now },
      created: { type: Date, default: Date.now }
  `)

//   shell.cp("-R", `${modelTemplate}`, modelDestination);
//   console.log(colors.green(`Template successfully copied to ${modelDestination}`))

//   shell.mv(`${modelDestination}/model.js`, `${modelDestination}/${args.modelName}.js`)
//   shell.sed(
//     "-i",
//     `\\[MODEL_NAME\\]`,
//     capitalize(args.modelName),
//     `${modelDestination}/${args.modelName}.js`
//   );
//   shell.sed(
//     "-i",
//     `\\[MONGOOSE_ARGS\\]`,
//     `"${capitalize(args.modelName)}", ${capitalize(args.modelName)}`,
//     `${modelDestination}/${args.modelName}.js`
//   );
//   shell.sed(
//     "-i",
//     `\\[MODEL_OBJECT\\]`,
//     `{${{...formatObject(args.modelColumns, true)}}}`,
//     `${modelDestination}/${args.modelName}.js`
//   );
}

const scaffoldSchema = (args, options, schemaDestination) => {
  readWriteToJSON(`${localPath}/server/db/schema.json`, (obj) => {
    obj.endpoints.push(args.modelName.toLowerCase())
    obj.schema[args.modelName.toLowerCase()] = objectify(args.modelColumns)
    return obj
  })

  readWriteToJSON(`${localPath}/client/src/config/schema.json`, (obj) => {
    obj.endpoints.push(args.modelName.toLowerCase())
    obj.schema[args.modelName.toLowerCase()] = objectify(args.modelColumns)
    return obj
  })
}

module.exports = (args, options, logger) => {
    console.log(args)
  
  //   const newModel = formatSchema(args.modelColumns);
  try {
    executeFromRoot((root) => {
      localPath = root
      
      if (!fs.existsSync(`${localPath}/server/db/models/${args.modelName}.js`)) {
        scaffoldModel(args, options)
        // scaffoldSchema(args, options)
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
