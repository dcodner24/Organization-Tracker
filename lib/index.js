// Import the required dependencies
const { prompt } = require("inquirer");
const logo = require("asciiart-logo");

// Import the modules containing the functions for each action
const dept = require('./department');
const role = require('./role');
const employee = require('./employee');
const { default: Prompt } = require("inquirer/lib/prompts/base");

// Create the logo text, defining a name property
const exitText = logo({ name: "GoodBye" }).render();


function mainMenu() {
    prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ['View Employees', 'View Departments', 'View Roles', 'Update an Employee Role', 'Add Employee', 'Add Department', 'Add Role', 'Quit']
      },
    ]).then((prompt) => {
      let choice = prompt.choice;
      // Switch case uses the strings from the choices array to call the appropriate function
      switch (choice) {
        case 'View Departments':
          dept.viewDepartments();
          break;

        case 'View Roles':
          role.viewRoles();
          break;

        case 'View Employees':
          employee.viewEmployees();
          break;

        case 'Add Department':
          dept.addDepartment();
          break;

        case 'Add Role':
          role.addRole();
          break;

        case "Add Employee":
          employee.addEmployee();
          break;

        case "Update an Employee Role":
          employee.updateRole();
          break;

        default:
          quit();
      }
    });
  }
  
// Exit function for application, shows asciiart-logo exit text before exiting
function quit() {
    console.log(exitText);
    process.exit();
  }


  module.exports = { mainMenu, quit};