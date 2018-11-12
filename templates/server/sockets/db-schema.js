// let schema;

module.exports = new Promise((resolve, reject) => {
  require("../database").then(res => {
    schema = res.schema;
    resolve({
      event: "schema",
      data: schema
    });
  });
});
