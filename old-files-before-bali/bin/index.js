#!/usr/bin/env node

// https://www.sitepoint.com/scaffolding-tool-caporal-js/   REFERENCE
"use strict";

const prog = require("caporal");
const createCmd = require("../lib/create");

prog
  .version("0.0.1")
  .command("create", "Create a new application")
  .argument("<template>", "Template to use")
  .argument("[schema...]", "schema")
  .option(
    "--variant <variant>",
    "Which <variant> of the template is going to be created"
  )
  .action(createCmd);
// .action((args, options, logger) => {
//   let schema = {};
//   for (let arg of args.schema) {
//     console.log(schema);
//     schema[arg] = arg;
//   }
//   console.log({
//     args: args,
//     options: options,
//     schema: schema
//   });
// });

prog.parse(process.argv);
