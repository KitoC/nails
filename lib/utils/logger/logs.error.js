module.exports = {
  // create generation errors
  dir_exists: "A directory with that name already exists.",
  file_exists: "A file with that name already exists.",

  // migration validation errors
  model_does_not_exist: "That model does not exist: ",
  add_column_migration_exists:
    "Migration/s adding these columns already exist: ",
  columns_dont_exist_on_table:
    "The following columns don't exist on that model. ",
  remove_column_migration_exists:
    "Migration/s removing these columns already exist: ",
  null_reference:
    "Cannot apply foreign key/s referencing a model that does not exist: ",
  model_migration_already_exists:
    "A model or scaffold migration with the same name has already been created: ",
  no_model_name:
    "You must specify a name for the model you are trying to generate.",

  // create cmd errors
  omit_no_match:
    "The option you passed in the omit flag does not match 'client' or 'server'."
};
