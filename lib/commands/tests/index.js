const { executeFromRoot, paths, iterateFiles } = require("../../utils");

const runSyncLoop = async (func, array, args = {}) => {
  const responses = [];
  for (let item of array) {
    if (typeof func === "object") {
      const response = await func[item.key]({ ...item, ...args });
      responses.push(response);
    }
    if (typeof func === "function") {
      const response = await func(item, args);
      responses.push(response);
    }
  }

  return responses;
};

const ADD_COLUMNS = args => {
  console.log(args.migration.action);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ type: "add" });
    }, 500);
  });
};

const REMOVE_COLUMNS = args => {
  console.log(args.migration.action);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ type: "remove" });
    }, 500);
  });
};

const CREATE_SCAFFOLD = args => {
  console.log(args.migration.action);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ type: "scaffold" });
    }, 500);
  });
};

const functionObj = {
  CREATE_SCAFFOLD,
  REMOVE_COLUMNS,
  ADD_COLUMNS
};

const appliedMigrationsArray = root => {
  const applied_migrations = require(paths.migrations({
    root: root,
    file: "applied_migrations"
  }));

  //   console.log(applied_migrations);
  const appliedMigrations = [];
  iterateFiles(`${root}/server/database/migrations`, (file, fnSplit) => {
    const migration = require(paths.migrations({ root, file }));
    if (applied_migrations[file]) {
      appliedMigrations.push({
        migration,
        file,
        key: migration.action,
        batch: applied_migrations[file].batch
      });
    }
  });

  return appliedMigrations;
};

module.exports = (args, options) => {
  executeFromRoot(async root => {
    const appliedMigrations = appliedMigrationsToArray(root);
    console.log(appliedMigrations.length);
    // const array = ["item1", "item2", "item3"];
    const responses = await runSyncLoop(functionObj, appliedMigrations, {
      database: "database",
      root
    });
    console.log(responses);
  });
};
