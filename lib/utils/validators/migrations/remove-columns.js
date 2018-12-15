const removeColumns = ({ modelSchema, modelName, columns, action }) => {
  return new Promise((resolve, reject) => {
    const invalidColumns = [];
    const columnsExist = [];
    const validatedColumns = {};

    const shemaModelColumns = Object.keys(modelSchema[modelName]);

    columns.forEach(column => {
      if (!shemaModelColumns.includes(column)) {
        invalidColumns.push(column);
      }

      if (shemaModelColumns.includes(column)) {
        validatedColumns[column] = modelSchema[modelName][column];
      }

      if (modelSchema.removedColumns.includes(column)) {
        columnsExist.push(column);
      }
    });

    if (columnsExist.length > 0) {
      reject({
        code: "remove_column_migration_exists",
        data: { model: modelName, columns: columnsExist }
      });
    }

    if (invalidColumns.length > 0) {
      reject({
        code: "columns_dont_exist_on_table",
        data: {
          model: modelName,
          columns: invalidColumns
        }
      });
    }

    resolve(validatedColumns);
  });
};

module.exports = removeColumns;
