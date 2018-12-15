const addColumns = ({ modelSchema, modelName, columns, action }) => {
  return new Promise((resolve, reject) => {
    const nullReferences = [];
    const columnsExist = [];
    let validatedColumns = {};

    validatedColumns = columns.modelObject;

    if (columns.hasForeignKeys.length > 0) {
      columns.hasForeignKeys.forEach(foreignKey => {
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

    const simpleColumns = Object.keys(columns.modelObject);

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
