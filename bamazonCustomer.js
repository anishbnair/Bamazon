
// load mysql npm package
var mysql = require("mysql");
// load inquirer npm package
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8899,

    user: "root",
    password: "",
    database: bamazon_db

});