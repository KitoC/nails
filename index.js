#!/usr/bin/env node

const colors = require("./lib/utils/colors");
const success = colors.success("\nNails success! ");
const error = colors.error("\nNails error! ");
const { errorLog, infoLog } = require("./lib/utils");

const prog = require("caporal");
const util = require("util");
const createCMD = require("./lib/commands/create");
// const testCmd = require("./lib/test-cmd");
const generationsCMD = require("./lib/commands/generations");
const dbCMD = require("./lib/commands/db");

// const errors = require("./error-handling");

// Create nails app command
prog
  .version("1.0.0")
  .command("create", "Create a new application")
  .argument("<newProjectName>", "Name of new project being generated")
  .option("--db <db>", "Which database the project is initially setup with.")
  .option(
    "--verbose <isVerbose>",
    "Pass in true to see the logs of the files being generated.",
    prog.BOOL
  )
  .option(
    "--omit <omit>",
    "Option lets you omit the client or server from being generated."
  )
  .action(createCMD);

// scaffold new model command

prog
  .command("generate", "TODO: Add relevant help info for generate command")
  .alias("g")
  .argument(
    "<action>",
    `Available actions below \n${util.inspect(
      ["model", "scaffold", "migration"],
      {
        depth: null,
        colors: true
      }
    )}\n`
  )
  .argument(
    "<type>",
    `Available types below \n${util.inspect(["add_columns"], {
      depth: null,
      colors: true
    })}\n`
  )
  .argument("[columns...]", "TODO: Add relevant help info")
  .help(`TODO`)
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
// prog
//   .command("test", "for testing commands")
//   // .argument("<modelName>", "New model name")
//   // .argument("[modelColumns...]", "Columns of model")
//   .help("TODO:remove once project is completed.")
//   .action(testCmd);

prog.parse(process.argv);
