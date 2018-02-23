

require("dotenv").config();

// load mysql npm package
var mysql = require("mysql");
// load inquirer npm package
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: process.env.mysql_host,
    port: process.env.mysql_port,
    user: process.env.mysql_user,
    password: process.env.mysql_pwd,
    database: "bamazon_db"
});


// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected to the database");
    // display items for sale if database connection is successful
    displayItemsForSale();
})


// function to display items for sale
function displayItemsForSale() {
    console.log("\n****************** Welcome to Bamazon!!! ************************");
    console.log("\n****************** Below are the items available for sale: ******\n");

    connection.query("SELECT * FROM products", function (error, result) {
        if (error) throw error;
        // log all items from database
        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            console.log("Item ID: " + result[i].item_id + " || Product Name: " + result[i].product_name + " || Price: " + result[i].price);
        }
        console.log("\n");
        connection.end();
    })
}