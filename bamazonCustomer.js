

require("dotenv").config();

// load mysql npm package
var mysql = require("mysql");
// load inquirer npm package
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: process.env.MYSQL_PWD,
    database: "bamazon_db"

});

console.log(process.env.MYSQL_PWD);

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected to the database");
})