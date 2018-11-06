class Sqlite3 {
  constructor(dbName, options) {
    this.dbName = dbName;
    this.dbType = "sqlite3";
    this.connection = null;
  }

  setDB() {
    const dbList = { sqlite3: require("sqlite3").verbose() };
    this.dbType = dbList[this.dbType];
    // console.log(this.database);
  }

  open() {
    this.setDB();
    this.connection = new this.dbType.Database(this.dbName, err => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`'Chinook' database connection OPEN.`);
    });
  }

  close() {
    this.connection.close(err => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`'Chinook' database connection CLOSED.`);
    });
  }

  insert(table, columns, values) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO ${table} (${columns})
      VALUES (${values})`;
      console.log(sql);
      this.connection.run(sql, (err, row) => {
        if (err) {
          return console.error(err.message);
        }
      });
      this.customSQL(
        `SELECT * FROM ${table} WHERE id = (SELECT MAX(id) FROM ${table})`
      ).then(data => {
        //   console.log("LAST ITEM IN TABLE", data);
        resolve(data);
      });
    });
  }

  get(id, table, customSQL) {
    return new Promise((resolve, reject) => {
      // REFACTOR THIS TO MAKE IT MORE GENERIC

      let sql = `SELECT * FROM ${table} WHERE id = ${id}`;

      this.connection.get(sql, [], (err, row) => {
        if (err) {
          return console.error(err.message);
        }

        return row
          ? resolve(row)
          : console.log(`No ${table} found with the id ${id}`);
      });
    });
  }

  find({ table, where, equals }) {
    return new Promise((resolve, reject) => {
      // REFACTOR THIS TO MAKE IT MORE GENERIC
      console.log("FIND PARAMS", table, where, equals);

      let sql = `SELECT * FROM ${table} WHERE ${where} = ${equals}`;

      this.connection.all(sql, [], (err, row) => {
        if (err) {
          return console.error(err.message);
        }

        return row
          ? resolve(row)
          : console.log(`No ${table} found with the id ${id}`);
      });
    });
  }

  all(table) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${table}`;

      this.connection.all(sql, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
        return rows ? resolve(rows) : console.log(`No users defined in table`);
      });
    });
  }

  update(id, table, columns) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE ${table}
      SET ${columns}
      WHERE id = ${id};
      
      `;

      this.connection.get(sql, [], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Update successful");
      });
      this.connection.get(
        `SELECT * FROM ${table} WHERE id = ${id};`,
        [],
        (err, row) => {
          if (err) {
            return console.error(err.message);
          }

          return row
            ? resolve(row)
            : console.log(`No ${table} found with the id ${id}`);
        }
      );
    });
  }

  delete(id, table) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM ${table}
      WHERE id = ${id};
      `;

      let deletedObj;

      this.connection.get(
        `SELECT * FROM ${table} WHERE id = ${id};`,
        [],
        (err, row) => {
          if (err) {
            return console.error(err.message);
          }

          return row
            ? (deletedObj = row)
            : console.log(`No ${table} found with the id ${id}`);
        }
      );

      this.connection.get(sql, [], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        if (deletedObj) {
          console.log(
            "The following entry was successfully deleted",
            deletedObj
          );
          resolve(deletedObj);
        } else {
          console.log("There are no entries that match that id.");
        }
      });
    });
  }

  createTable(table, columns) {
    let sql = `CREATE TABLE ${table} (
       ${columns}
    )`;
    console.log(sql);
    this.connection.run(sql, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(
        `The ${table} table has been CREATED for the ${this.dbName} database.`
      );
    });
  }

  dropTable(table) {
    let sql = `DROP TABLE ${table}`;
    this.connection.run(sql, err => {
      if (err) {
        return console.error(err.message);
      }
      console.log(
        `The ${table} table has been DROPPED from the ${this.dbName} database.`
      );
    });
  }

  serialize() {
    this.connection.serialize();
  }

  setSchema(columns) {
    let defaultValue = "";
    let tabelColumns = `id integer primary key`;
    for (let key in columns) {
      if (columns[key].default) {
        if (columns[key].default === "date.now") {
          defaultValue = ` DEFAULT CURRENT_TIMESTAMP`;
        } else if (columns[key].default === "bit") {
          defaultValue = ` DEFAULT ${columns[key].default}`;
        } else {
          defaultValue = ` DEFAULT '${columns[key].default}'`;
        }
      }
      tabelColumns += `, ${key} ${columns[key].type}${defaultValue}`;
      defaultValue = "";
    }
    return tabelColumns;
  }

  customSQL(sql) {
    return new Promise((resolve, reject) => {
      this.connection.get(sql, [], (err, row) => {
        if (err) {
          return console.error(err.message);
        }

        return row
          ? resolve(row)
          : console.log(`No ${table} found with the id ${id}`);
      });
    });
  }
}

// const database = new SQL("./databases/zoot.db");
module.exports = Sqlite3;

// database.open();
// database.serialize();

// database.delete(4, "Bears").then(data => {
//   console.log(data);
// });
// database.all("Bears").then(data => {
//   console.log(data);
// });
// database.close();

// exampleDB.createTable(
//   `Users`,
//   `id integer primary key, FirstName varchar(255), LastName varchar(255)`
// );

// exampleDB.insert(`Users`, `FirstName`, `'Kito'`).then(data => {
//   console.log(`New table entry: `, data);
// });
// exampleDB.insert(`Users`, `FirstName`, `'Collette'`).then(data => {
//   console.log(`New table entry: `, data);
// });
// exampleDB.insert(`Users`, `FirstName`, `'Anna'`).then(data => {
//   console.log(`New table entry: `, data);
// });

// exampleDB.get(1, "Users").then(data => {
//   console.log("user id 1 ", data);
// });

// exampleDB.createTable(
//   `Orders`,
//   `id integer primary key, OrderNumber int, UserId int, FOREIGN KEY (UserId) REFERENCES Users(id)`
// );
// exampleDB.insert(`Orders`, `UserId, OrderNumber`, `1, 1`).then(data => {
//   console.log(`New table entry: `, data);
// });
// exampleDB.insert(`Orders`, `UserId, OrderNumber`, `2, 2`).then(data => {
//   console.log(`New table entry: `, data);
// });
// exampleDB.insert(`Orders`, `UserId, OrderNumber`, `2, 3`).then(data => {
//   console.log(`New table entry: `, data);
// });
// exampleDB.insert(`Orders`, `UserId, OrderNumber`, `1, 4`).then(data => {
//   console.log(`New table entry: `, data);
// });

// exampleDB.find({ table: "Orders", where: "UserId", equals: 3 }).then(data => {
//   console.log("FOUND => orders ", data);
// });

// const columns = {
//   title: {
//     type: "tinytext",
//     default: "default text"
//   },
//   created_at: {
//     type: "datetime",
//     default: "date.now"
//   },
//   updated_at: {
//     type: "datetime",
//     default: "date.now"
//   },
//   paws: {
//     type: "int"
//   },
//   claws: {
//     type: "int",
//     default: 34
//   },
//   hungry: {
//     type: "bit"
//   }
// };
// exampleDB.setSchema(columns);

// exampleDB.createTable(`Bears`, exampleDB.setSchema(columns));
// exampleDB.insert(`Bears`, `paws, hungry`, `1, false`).then(data => {
//   console.log(`New table entry: `, data);
// });
// // exampleDB.all(`Users`).then(data => {
// //   console.log("All users then", data);
// // });

// // exampleDB.all(`Orders`).then(data => {
// //   console.log("All orders then", data);
// // });

// // exampleDB
// //   .update(1, `Users`, `FirstName = 'Bradley', LastName = 'Cooper'`)
// //   .then(data => {
// //     console.log("UPDATED user", data);
// //   });

// // exampleDB.all(`Users`).then(data => {
// //   console.log("All users then", data);
// // });

// exampleDB.dropTable(`Users`);
// exampleDB.dropTable(`Orders`);
// exampleDB.dropTable(`Bears`);
// exampleDB.close();
