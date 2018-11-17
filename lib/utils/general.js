const fs = require("fs");
const shell = require("shelljs");
const { inspect } = require("util");

const colors = require("./colors");
const util = require("util");

const nailsSuccess = colors.success("\nNails success! ");
const nailsError = colors.error("\nNails error! ");

const { iterateFiles, writeFile } = require("./file-manipulation");
const { paths } = require("./paths");
const logger = require("./logger");
const Hammered = require("hammered-orm");
// ensures that the callback passed in is executed in the root dir of project.

// const executeFromRoot = callback => {
//   let condition = true;
//   while (condition) {
//     let localPath = process.cwd();
//     const pkgCheck = fs.existsSync(`${localPath}/package.json`);
//     if (pkgCheck) {
//       const pkg = require(`${localPath}/package.json`);

//       callback(localPath);
//       condition = false;
//       localPath = null;
//       return;
//     } else if (!pkgCheck || localPath === "/") {
//       if (localPath === "/") {
//         condition = false;
//         localPath = null;
//         return;
//       }
//       if (!pkgCheck) {
//         shell.cd("..");
//       }
//     }
//   }
// };

const executeFromRoot = callback => {
  let condition = true;
  while (condition) {
    const localPath = process.cwd();
    const pkgCheck = fs.existsSync(`${localPath}/package.json`);
    if (pkgCheck) {
      const pkg = require(`${localPath}/package.json`);

      if (pkg.nails) {
        // shell.cd("");
        callback(localPath);
        condition = false;
      }
      shell.cd("..");
    } else if (!pkgCheck || localPath === "/") {
      console.log(
        nailsError +
          "You must be inside the directory of a nails project to perform that action."
      );
      condition = false;
    }
  }
};

// Error logging
const errorLog = err => {
  let data = "";
  let message = err;
  if (err.message) {
    message = err.message;
  }
  if (err.data) {
    data = err.data;
    return console.log(
      nailsError + message,
      util.inspect(data, {
        compact: err.compact,
        depth: null,
        colors: true
      })
    );
  }
  if (err.message) {
    message = err.message;
  }
  return console.log(nailsError + message);
};

// Info logging
const infoLog = info => {
  let data = "";

  if (info.data) {
    data = info.data;
    return console.log(
      colors.info(`${info.action} => `) + info.message,
      util.inspect(data, {
        compact: false,
        depth: null,
        colors: true
      })
    );
  }
  return console.log(colors.info(`Nails ${info.action} => `) + info.message);
};

// Success logging
const successLog = success => {
  if (success.data) {
    data = success.data;
    return console.log(
      `${nailsSuccess} ${success.message} ${util.inspect(data, {
        compact: false,
        depth: null,
        colors: true
      })}`
    );
  }

  return console.log(`${nailsSuccess} ${success.message}`);
};

const timestamps = {
  created_at: { type: "date", default: "date.now" },
  updated_at: { type: "date", default: "date.now" }
};

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

const migrationsArray = ({ root, applied, pending }) => {
  const migrationPath = paths.migrations({ root });
  const applied_migrations = require(`${migrationPath}/applied_migrations`);

  const appliedMigrations = [];
  const pendingMigrations = [];

  iterateFiles(migrationPath, (file, fnSplit) => {
    const migration = require(paths.migrations({ root, file }));
    if (applied) {
      if (applied_migrations[file]) {
        appliedMigrations.push({
          migration,
          file,
          key: migration.action,
          batch: applied_migrations[file].batch
        });
      }
    }
    if (pending) {
      if (!applied_migrations[file] && file !== "applied_migrations.js") {
        pendingMigrations.push({
          migration,
          path: migrationPath + file,
          file,
          key: migration.action
        });
      }
    }
  });

  return { appliedMigrations, applied_migrations, pendingMigrations };
};

const connectToDatabase = ({ root }) => {
  return new Promise(async (resolve, reject) => {
    const config = require(`${root}/server/config.js`);
    const development = config.database.development;

    development.path = `/server${development.path}`;

    const database = new Hammered({ config: development });

    await database.connect(() => {});
    if (development.adaptor === "sqlite3") {
      database.serialize();
    }
    resolve(database);
  });
};

const handleAppliedMigrationsFile = ({
  applied_migrations,
  responses,
  root,
  isMigration,
  batchDate
}) => {
  const infoText = isMigration ? "migration" : "rollback";

  responses.forEach(migration => {
    logger.custom({
      template: `nails ${infoText} => `,
      msg: `${migration} 🤓`,
      color: "warn"
    });
    if (!isMigration) {
      delete applied_migrations[migration];
    }
    if (isMigration) {
      applied_migrations[migration] = { batchDate };
    }
  });
  return writeFile(
    `${root}/server/database/migrations/applied_migrations.js`,
    `module.exports = ${inspect(applied_migrations, {
      compact: false,
      depth: null
    })}`
  );
  // return applied_migrations;
};

module.exports = {
  executeFromRoot,
  nailsSuccess,
  nailsError,
  errorLog,
  infoLog,
  successLog,
  timestamps,
  runSyncLoop,
  migrationsArray,
  connectToDatabase,
  handleAppliedMigrationsFile
};
