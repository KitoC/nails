module.exports = (args, options, logger) => {
  // RUNNING MIGRATIONS

  // $ rake db:migrate VERSION=20080906120000
  // $ rake db:rollback
  // $ rake db:rollback STEP=3
  // $ rake db:migrate:redo STEP=3
  // $ rake db:reset  #drop database and recreate it
  // $ rake db:migrate:up VERSION=20080906120000

  // MIGRATION COMMANDS

  // rake db:migrate         # Migrate the database (options: VERSION=x, VERBOSE=false).
  // rake db:migrate:status  # Display status of migrations
  // rake db:rollback        # Rolls the schema back to the previous version (specify steps w/ STEP=n).
  // rake db:test:prepare    # Rebuild it from scratch according to the specs defined in the development database

  // DATABASE COMMANDS

  //   rake db:create          # Create the database from config/database.yml for the current Rails.env (use db:create:all to create all dbs in t...
  //   rake db:drop            # Drops the database for the current Rails.env (use db:drop:all to drop all databases)
  //   rake db:fixtures:load   # Load fixtures into the current environment's database.
  //   rake db:schema:dump     # Create a db/schema.rb file that can be portably used against any DB supported by AR
  //   rake db:schema:load     # Load a schema.rb file into the database
  //   rake db:seed            # Load the seed data from db/seeds.rb
  //   rake db:setup           # Create the database, load the schema, and initialize with the seed data (use db:reset to also drop the db first)
  //   rake db:structure:dump  # Dump the database structure to db/structure.sql. Specify another file with DB_STRUCTURE=db/my_structure.sql
  //   rake db:version         # Retrieves the current schema version number

  args.action.split(":");
  try {
    switch (args.action) {
      case "migrate":
        return require("./migrations")(args, options, logger);

      case "rollback":
        return require("./rollback")(args, options, logger);

      default:
        console.warn(
          `That action (${args.action}) does not match any actions in Nails.`
        );
    }
  } catch (err) {
    console.log(err);
  }
};
