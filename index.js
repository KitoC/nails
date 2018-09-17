#!/usr/bin/env node

const prog = require("caporal");
const createCmd = require("./lib/create");
const scaffoldCmd = require("./lib/scaffold");

prog
  .version("1.0.0")
  .command("new", "Create a new application")
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
  .help("TO BE FILLED")
  .action(scaffoldCmd);

prog.parse(process.argv);
