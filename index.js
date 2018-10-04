#!/usr/bin/env node

const prog = require("caporal");
const createCmd = require("./lib/create-cmd");
const testCmd = require("./lib/test-cmd");
const generationsCMD = require("./lib/generations");
const dbCMD = require("./lib/db");

// Create nails app command
prog
  .version("1.0.0")
  .command("create", "Create a new application")
  .argument("<newProjectName>", "Name of new project being generated")
  .option(
    "--variant <variant>",
    "Which <variant> of the template is going to be created"
  )
  .action(createCmd);

// scaffold new model command
prog
  .command("g", "TODO: Add relevant help info")
  .argument("<action>", "TODO: Add relevant help info")
  .argument("<type>", "TODO: Add relevant help info")
  .argument("[columns...]", "TODO: Add relevant help info")
  .help("TODO: Add relevant help info")
  .action(generationsCMD);

// scaffold new model command
prog
  .command("db", "TODO: Add relevant help info")
  .argument("<action>", "TODO: Add relevant help info")
  .argument("[columns...]", "TODO: Add relevant help info")
  .help("TODO: Add relevant help info")
  .action(dbCMD);

// Testing purposes
prog
  .command("test", "for testing commands")
  // .argument("<modelName>", "New model name")
  // .argument("[modelColumns...]", "Columns of model")
  .help("TODO:remove once project is completed.")
  .action(testCmd);

prog.parse(process.argv);
