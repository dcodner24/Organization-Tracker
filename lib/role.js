// Description: This file contains the functions to view and add roles to the database
// Import the database connection and dependencies
const { prompt } = require("inquirer");
const db = require('../config/connection')
require("console.table");

// View existing roles
function viewRoles() {
  const index = require('../index');
  const main = require('./index')
  const sql = `SELECT * FROM role;`;

  db.promise().query(sql)
    .then(([rows]) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })

    .then(() => {
      prompt({
        type: "confirm",
        name: "continue",
        message: "Would you like to quit the application?",
        default: false,
      })
        .then((answer) => {
          if (answer.continue) {
            main.quit();
          } else {
            index.startApp();
          }
        });
    })
};


// Add a role to the database
function addRole() {
  const index = require('../index');
  const main = require('./index')
  const deptSql = `SELECT * FROM department`;
  const sql = "INSERT INTO role SET ?";
  const sqlCheck = `SELECT role.title FROM role`;

  db.promise().query(deptSql)
    .then(([rows]) => {
      // Map the department names and ids into an array of objects to be used in the inquirer prompt
      const departments = rows.map(({ id, deptName }) => ({
        name: deptName,
        value: id,
      }));

      prompt([
        {
          name: "title",
          message: "Please input the title of the new role.",
        },
        {
          name: "salary",
          message: "Please input the salary of the new role.",
        },
        {
          type: "list",
          name: "department_id",
          message: "Please select the department for the new role.",
          choices: departments,
        },
      ])
        .then((role) => {
          db.promise().query(sqlCheck)
            .then(([rows]) => {
              let titles = rows.map(({ title }) => title);
              if (titles.includes(role.title)) {
                console.log(`\n${role.title} already exists in the system, error encountered, shutting down.\n`);
                main.quit();
              }
            })
            .then(() => {
              db.promise().query(sql, role)
                .then(() => console.log(`\nAdded ${role.title} to the database \n`))

                .then(() => {
                  prompt({
                    type: "confirm",
                    name: "continue",
                    message: "Would you like to quit the application?",
                    default: false,
                  })
                    .then((answer) => {
                      if (answer.continue) {
                        main.quit();
                      } else {
                        index.startApp();
                      }
                    });
                });
            });
        });
    });
};

module.exports = { viewRoles, addRole }