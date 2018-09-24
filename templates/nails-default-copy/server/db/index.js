

const json = require('./schema')
const schema = JSON.parse(JSON.stringify(json))

const generatedModels = {}
schema.endpoints.map(endpoint => {
    generatedModels[endpoint] = require(`./models/${endpoint}`)
})

module.exports = {...generatedModels, schema}