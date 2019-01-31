const templateDir = `${__dirname}/../../templates`;

const route = require(`${templateDir}/generations/route.js`);
const model = require(`${templateDir}/generations/model.js`);

module.exports = { route, model };
