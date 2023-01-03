// Description: This file contains the functions to add and update an employee

// Import the database connection and dependencies
const { prompt } = require("inquirer");
const db = require('../config/connection')
require("console.table");

// View all employees
function viewEmployees() {
  const index = require('../index');
  const main = require('./index')
  const sql = `SELECT * FROM employee`;

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

// Add an employee to the database
function addEmployee() {
  //Require the index file to call the start app function after the add employee function is complete
  const index = require('../index');
  const main = require('./index')
  let rolesSql = 'SELECT * FROM role';
  let managersSql = 'SELECT * FROM employee';
  let sql = `INSERT INTO employee SET ?`;
  let sqlCheck = `SELECT employee.first_Name, employee.last_Name FROM employee`;

  prompt([
    {
      name: "firstName",
      message: "Please enter employee's first name.",
    },
    {
      name: "lastName",
      message: "Please enter employee's last name. ",
    },
  ])
    // Pull first and last name into the promise resolution
    .then((name) => {
      // Check for duplicate employee names, if a duplicate is found, the program will exit with a descriptive error message.
      db.promise().query(sqlCheck)
        .then(([rows]) => {

          for (let i = 0; i < rows.length; i++) {
            if (rows[i].first_Name === name.firstName && rows[i].last_Name === name.lastName) {
              console.error(`${name.firstName} ${name.lastName} already exists in the system, error encountered, shutting down.`)
              main.quit(); 
            }
          };
        });

      // Get roles from database to display in the prompt
      db.promise().query(rolesSql)
        .then(([rows]) => {
          // Map over roles table to create an array with only role titles and ids
          const roles = rows.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "Please select a role for the new employee.",
            choices: roles,
          })
            .then((role) => {
              db.promise().query(managersSql)
                .then(([rows]) => {
                  // Map over employees table to create an array with only employee names and ids
                  const managerChoices = rows.map(
                    ({ id, first_name, last_name }) => ({
                      name: `${first_name} ${last_name}`,
                      value: id,
                    })
                  );

                  // Add a "No Manager" option to the array
                  managerChoices.unshift({ name: "No Manager", value: null });

                  // Pass the manager choices into the prompt
                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Please select an employee to be the manager of the new employee, or select 'No Manager' if the new employee does not have a manager.",
                    choices: managerChoices,
                  })
                    .then((manager) => {
                      // Create a new employee object to be added to the database
                      let newEmployee = {
                        manager_id: manager.managerId,
                        role_id: role.roleId,
                        first_name: name.firstName,
                        last_name: name.lastName,
                      };

                      db.promise().query(sql, newEmployee);
                    })
                    .then(() =>
                      console.log(`\nSuccessfully added User:${name.firstName} ${name.lastName}\n`)
                    )

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
    });
};


// Update an employee's role
function updateRole() {
  const index = require('../index');
  const main = require('./index')
  const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
  const rolesSql = 'SELECT * FROM role';
  const employeeSql = 'SELECT * FROM employee';
  const sqlCheck = `SELECT employee.first_Name, employee.last_Name, employee.role_id FROM employee`;
  const sql2 = 'SELECT * FROM employee WHERE id = ?'

  db.promise().query(employeeSql)
    .then(([rows]) => {

      // Map over employees table to create an array with only employee names and ids to be used in the prompt
      const employees = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      prompt([
        {
          type: "list",
          name: "employeeSelection",
          message: "Which employee's role do you want to update?",
          choices: employees,
        },
      ])

        .then((employee) => {
          // This is defined here

          db.promise().query(rolesSql)
            .then(([rows]) => {
              // Map over roles table to create an array with only role titles and ids to be used in the prompt
              const roles = rows.map(({ id, title }) => ({
                name: title,
                value: id,
              }));

              prompt([
                {
                  type: "list",
                  name: "roleSelection",
                  message: "Please select a new role for the employee.",
                  choices: roles,
                },
              ])
                .then((role) => {

                  // Check for duplicate employee names, if a duplicate is found, the program will exit with a descriptive error message.
                  db.promise().query(sqlCheck)
                    .then(([rows]) => {
                      // console.table(rows)
                      for (let i = 0; i < rows.length; i++) {
                        if (rows[i].role_id === role.roleId) {
                          console.error(`${rows[i].first_Name} ${rows[i].last_Name} cannot be assigned the same role as they already have, error encountered, shutting down.`)
                          process.exit(0);
                        }
                      };
                    })
                    .then(() => db.promise().query(sql, [role.roleSelection, employee.employeeSelection]))
                    .then(() => {
                      // console.log(employee.employeeSelection)
                      // Retreive the employee's name from the database to display in the console log
                      db.promise().query(sql2, [employee.employeeSelection])
                        .then(([rows]) => {
                          console.log(`\nSuccessfully updated User: ${rows[0].first_name} ${rows[0].last_name}\n`)
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
                    });
                });
            });
        });
    });
};


module.exports = { viewEmployees, addEmployee, updateRole };