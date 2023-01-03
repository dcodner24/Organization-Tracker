// View all roles
function viewRoles() {
    db.promise().query('SELECT * FROM role;')
      .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
      })
      
      .then(() => mainMenu());
  }
  
  
  function viewEmployees() {
    db.promise().query('SELECT * FROM employee;')
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      
      .then(() => mainMenu());
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
              
              .then(() => mainMenu());
          });
      });
  }