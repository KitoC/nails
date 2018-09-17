const config = {}


// Create a .env file in the root to use environment variables, add this file to gitignore.
require('dotenv').config()

// configuration for discerning between a test, development and production database.

config.mongoURI = {
    development: process.env.DEVELOPMENT_DB,
    test: process.env.TEST_DB,
    production: process.env.PRODUCTION_DB
}

module.exports = config
