import schemaJson from './schema.json'

const schemas = schemaJson.schema
const endpoints = schemaJson.endpoints


const extractKeys = (schema, omitted = {}) => {
  const schemaKeys = [];

  for (var key in schema) {
    if (!omitted[key] && schema.hasOwnProperty(key)) {
      schemaKeys.push({name: key, type: schema[key]});
    }
  }
  return schemaKeys;
};

export { schemas, extractKeys, endpoints };
