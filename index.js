const { prompt } = require("inquirer");
const db = require("./config/connection");
const logo = require("asciiart-logo");
require("console.table");

const logoText = logo({ name: "Welome to Employee Manager" }).render();
const mainText = logo({ name: "Main Menu" }).render();
const exitText = logo({ name: "GoodBye" }).render();


console.log(logoText);
mainMenu();

function mainMenu() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update an Employee Role', 'Quit']
    },
  ]).then((prompt) => {
    let choice = prompt.choice;
    // Functions are called using switch cases to resolve the inquirer promise
    switch (choice) {
      case 'View Departments':
        viewAllDepartments();
        break;
      case 'View Roles':
        viewRoles();
        break;
      case 'View Employees':
        viewEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update an Employee Role":
        updateEmployeeRole();
        break;
      default:
        quit();
    }
  });
}

// View all deparments
function viewAllDepartments() {
  db.promise().query("SELECT * FROM department;")
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => console.log(mainText))
    .then(() => mainMenu());
}

// View all roles
function viewRoles() {
  db.promise().query('SELECT * FROM role;')
    .then(([rows]) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })
    .then(() => console.log(mainText))
    .then(() => mainMenu());
}

// Functions the switch case points to
function viewEmployees() {
  db.promise().query('SELECT * FROM employee;')
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => console.log(mainText))
    .then(() => mainMenu());
}

// Add a department
function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ])
    .then((prompt) => {
      let name = prompt.name;
      db.promise().query('INSERT INTO department (name) VALUES (?)', name, (err, result) => {
        if (err) {
          console.log(err);
        }
      })
        .then(() => console.log(`\nAdded ${name} to the database.\n
        `))
        .then(() => console.log(mainText))
        .then(() => mainMenu());
    });
}

// Add a role
function addRole() {
  db.promise().query('SELECT * FROM  department')
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      prompt([
        {
          name: "title",
          message: "What is the name of the role?",
        },
        {
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices,
        },
      ])
        .then((role) => {
          db.promise().query("INSERT INTO role SET ?", role)
            .then(() => console.log(`\nAdded ${role.title} to the database \n`))
            .then(() => console.log(mainText))
            .then(() => mainMenu());
        });
    });
}

// Add an employee
function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ])
    .then((res) => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      db.promise().query('SELECT * FROM role;')
        .then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices,
          })
            .then((res) => {
              let roleId = res.roleId;

              db.promise().query('SELECT * FROM employee;')
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(
                    ({ id, first_name, last_name }) => ({
                      name: `${first_name} ${last_name}`,
                      value: id,
                    })
                  );

                  managerChoices.unshift({ name: "None", value: null });

                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices,
                  })
                    .then((res) => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName,
                      };

                      db.promise().query("INSERT INTO employee SET ?", employee);
                    })
                    .then(() =>
                      console.log(`\nAdded ${firstName} ${lastName} to the database \n`)
                    )
                    .then(() => console.log(mainText))
                    .then(() => mainMenu());
                });
            });
        });
    });
}


// Update an employee's role
function updateEmployeeRole() {
  db.promise().query('SELECT * FROM employee')
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices,
        },
      ])
        .then((res) => {
          let employeeId = res.employeeId;
          db.promise().query('SELECT * FROM role')
            .then(([rows]) => {
              let roles = rows;
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id,
              }));

              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign the selected employee?",
                  choices: roleChoices,
                },
              ])
                .then((res, employeeId) => db.promise().query(
                  "UPDATE employee SET role_id = ? WHERE id = ?",
                  [res.roleId, employeeId]))
                .then(() => console.log("\nUpdated employee's role \n"))
                .then(() => console.log(mainText))
                .then(() => mainMenu());
            });
        });
    });
}

// Exit the application
function quit() {
  console.log(exitText);
  process.exit();
}
