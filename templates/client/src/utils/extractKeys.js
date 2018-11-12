const extractKeys = (schema, omitted = {}) => {
  const schemaKeys = [];
  console.log(schema);

  // schemaKeys.push({ name: "id", type: "number" });
  for (var key in schema) {
    if (!omitted[key] && schema.hasOwnProperty(key)) {
      schemaKeys.push({ name: key, type: schema[key].type });
    }
  }
  return schemaKeys;
};

export default extractKeys;
