use employees_db;

INSERT INTO department
    (deptName)
VALUES
    ('Development'),
    ('Testing'),
    ('Branding'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Lead Developer', 100000, 1),
    ('Developer', 80000, 1),
    ('Lead Tester', 150000, 2),
    ('Tester', 120000, 2),
    ('Branding Manager', 160000, 3),
    ('Graphic Designer', 125000, 3),
    ('Legal Manager', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Kevin', 'Flynn', 1, NULL),
    ('Alan', 'Bradley', 2, 1),
    ('Sam', 'Flynn', 3, NULL),
    ('Program', 'Quorra', 4, 3),
    ('Edward', 'Dillinger', 5, NULL),
    ('Program', 'Master Control', 6, 5),
    ('Program', 'Clu', 7, NULL),
    ('Program', 'Tron', 8, 7);
