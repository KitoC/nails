const { objectify } = require("../../db");

const addColumns = ({ modelSchema, modelName, columns, action }) => {
  return new Promise((resolve, reject) => {
    const nullReferences = [];
    const columnsExist = [];
    let validatedColumns = {};

    const { passed, ...rest } = objectify(columns);

    if (!passed) {
      reject({
        msg: "One or more data types you have specified are incorrect: \n",
        data: rest.wrongDataTypes
      });
    }

    validatedColumns = rest.modelObject;

    if (rest.hasForeignKeys.length > 0) {
      rest.hasForeignKeys.forEach(foreignKey => {
        if (!modelSchema.existingTables.includes(foreignKey)) {
          nullReferences.push(foreignKey);
        }
      });
    }

    if (nullReferences.length > 0) {
      reject({
        code: "null_reference",
        data: {
          model: modelName,
          columns: nullReferences
        }
      });
    }

    const simpleColumns = Object.keys(rest.modelObject);

    if (!modelSchema.hasOwnProperty(modelName)) {
      reject({ code: "model_does_not_exist", after: modelName });
    }

    const shemaModelColumns = Object.keys(modelSchema[modelName]);

    simpleColumns.forEach(column => {
      if (shemaModelColumns.includes(column)) {
        validatedColumns[column] = modelSchema[modelName][column];
      }

      if (modelSchema.addedColumns.includes(column)) {
        columnsExist.push(column);
      }
    });

    if (columnsExist.length > 0) {
      reject({
        code: "add_column_migration_exists",
        data: { model: modelName, columns: columnsExist }
      });
    }

    resolve(validatedColumns);
  });
};

module.exports = addColumns;
