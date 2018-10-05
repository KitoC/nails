#!/usr/bin/env node

const colors = require("./lib/colors");
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");

const prog = require("caporal");
const createCmd = require("./lib/create-cmd");
const testCmd = require("./lib/test-cmd");
const generationsCMD = require("./lib/generations");
const dbCMD = require("./lib/db");

// const errors = require("./error-handling");

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

// generations command
prog
  .command("db", "TODO: Add relevant help info")
  .argument("<action>", "TODO: Add relevant help info", function(opt) {
    if (["rollback", "migrate"].includes(opt) === false) {
      throw error +
        colors.info("Options for db command are: rollback, migrate...");
    }
    return opt.toLowerCase();
  })
  // TODO: Provide proper error handling for this
  .argument("[type...]", "TODO: Add relevant help info")
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
