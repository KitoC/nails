
const fs = require("fs");
const shell = require("shelljs");




// ensures that the callback passed in is executed in the root dir of project.
const executeFromRoot = (callback) => {
  
  let condition = true
  while (condition) {
    const localPath = process.cwd();
    if (fs.existsSync(`${localPath}/package.json`)) {
      
      const pkg = require(`${localPath}/package.json`)
      console.log(process.cwd())

      console.log('before conditional', pkg.name)
      if (pkg.nails) {
        console.log('after conditional', pkg.name)
        console.log("executing command from root directory")
        shell.cd('')
        callback(localPath)
        condition = false
      }
      shell.cd("..")
    }
  }
};

// reads JSON file and writes whatever is returned from callback back into same file.
const readWriteToJSON = (path, callback) => {
  fs.readFile(path, 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err, '\nJSON read error path: ', path);
    } else {
      obj = JSON.parse(data); //now it an object

      json = JSON.stringify(callback(obj)); //convert it back to json
      fs.writeFile(path, json, 'utf8', callback = (err) => {
        if (err) {
          console.log(err, '\nJSON read error path: ', path)
        }
        console.log('readWriteToJSON was successful')
      }); // write it back 
    }
  });
}

// TODO: datatype checking.
const dataType = string => {
  // TODO: Check mongoose docs to see what data types Iam missing.
  switch (string.toLowerCase()) {
    case "string":
      return {dataType: String, stringified: 'string'};
    case "number":
      return {dataType: Number, stringified: 'number'};
    case "array":
      return {dataType: Array, stringified: 'array'};
    case "number":
      return {dataType: Object, stringified: 'object'};
  }
};

// Capitalizes first letter of a string
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Formats the args.modelColumns into an object template literal for replacing variables in model.js template.
const formatModelString = arr => {
  
  return arr.map(col => {
    const colName = col.split(":")[0];
    const colType = col.split(":")[1];
    if(colType === 'longtext') {
      return `\n      ${colName}: String`;
    }
    return `\n      ${colName}: ${capitalize(colType)}`;
  });
};

// checks to make sure the model name is "legal"
const checkModelName = () => {

}
// Turns args.modelColumns into an actual javascript object.
const objectify = arr => {
  const object = {}
  arr.map(col => {
    const colName = col.split(":")[0].toLowerCase();
    const colType = col.split(":")[1].toLowerCase();
    if(colType === 'longtext') {
      object[colName] = 'longtext'
    }
    object[colName] = colType
  });
  return object
}

// Not sure if this is needed? formats args.modelColumns into a JSON template literal string.
// const formatSchemaJSON = arr => {
//   return arr.map(col => {
//     const colName = col.split(":")[0];
//     const colType = col.split(":")[1];
//     return ` "${colName}": "${colType.toLowerCase()}"`;
//   });
// };

module.exports = { formatModelString, capitalize, objectify, readWriteToJSON, executeFromRoot};
