// Description: This file contains the functions for viewing and adding departments to the tracker.

// Import the database connection and dependencies
const { prompt } = require("inquirer");
const db = require('../config/connection')
require("console.table");

// View all deparments
function viewDepartments() {
    const index = require('../index');
    const main = require('./index')
    const sql = `SELECT * FROM department`;

    db.promise().query(sql)
        .then(([rows]) => {

            console.log("\n");
            console.table(rows);
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
          });
};

// Function for adding a department to tracker
// This function is not working as intended, the program is exiting after detecting a duplicate department name. Workaround to be addressed in future updates.

function addDepartment() {
    const index = require('../index');
    const main = require('./index')
    const sqlCheck = 'SELECT department.deptName FROM department'
    const sql = 'INSERT INTO department (deptName) VALUES (?)'

    prompt([
        {
            name: "departmentName",
            message: "Please enter the name of the new department.",
        },
    ])
        .then((dept) => {
            // Check for duplicate department names
            db.promise().query(sqlCheck)
                .then(([rows]) => {

                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i].deptName === dept.departmentName) {
                            console.error(`${dept.departmentName} already exists in the system, error encountered, shutting down.`)
                            process.exit(0);
                        }
                    };
                });


            db.promise().query(sql, dept.departmentName, (err) => {
                if (err) {
                    console.error(err);
                }
            })
                .then(() => console.log(`\nSuccessfully added Department: ${dept.departmentName}\n`))
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
}

module.exports = { viewDepartments, addDepartment }