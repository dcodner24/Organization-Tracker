const index = require('./lib/index')
const logo = require("asciiart-logo");
const logoText = logo({ name: "Welome to the ENCOM Employee Manager" }).render();


function startApp(){
console.log(logoText);
index.mainMenu();
};

startApp();

module.exports = { startApp }