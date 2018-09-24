#!/usr/bin/env node

const prog = require("caporal");
const createCmd = require("./lib/create-cmd");
const scaffoldCmd = require("./lib/scaffold-cmd");
const testCmd = require("./lib/test-cmd");

prog
  .version("1.0.0")
  .command("create", "Create a new application")
  .argument("<newProjectName>", "Name of new project being generated")
  .option(
    "--variant <variant>",
    "Which <variant> of the template is going to be created"
  )
  .action(createCmd)
  .command(
    "scaffold",
    "Scaffolds a new schema model and related views for said model"
  )
  .argument("<modelName>", "New model name")
  .argument("[modelColumns...]", "Columns of model")
  .help("TODO: Add relevant help info")
  .action(scaffoldCmd)
  .command(
    "test",
    "for testing commands"
  )
  .argument("<modelName>", "New model name")
  .argument("[modelColumns...]", "Columns of model")
  .help("TODO:remove once project is completed.")
  .action(testCmd)


prog.parse(process.argv);
