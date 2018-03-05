// ===============================================================================
// DEPENDENCIES
// ===============================================================================

require("dotenv").config();

// load mysql npm package
var mysql = require("mysql");
// load inquirer npm package
var inquirer = require("inquirer");
// load chalk npm package
var chalk = require("chalk");
// load chalk cli-table package
var Table = require("cli-table");


// MYSQL Connection
var db = mysql.createConnection({
    host: process.env.mysql_host,
    port: process.env.PORT || 3306,
    user: process.env.mysql_user,
    password: process.env.mysql_pwd,
    database: "bamazon_db"
});


// connect to the mysql server and sql database
db.connect(function (err) {
    if (err) throw err;
    // display items for sale if database connection is successful
    displayItemsForSale();
})


// function to display items for sale
function displayItemsForSale() {
    console.log(chalk.magentaBright("\n************************************** WELCOME TO BAMAZON!!! **********************************************"));
    console.log(chalk.magentaBright("\n************************************** Below are the items available for sale: ****************************\n"));

    db.query("SELECT * FROM products", function (error, result) {
        if (error) throw error;
        // log all items from database
        //Create a new Table in the cli-table view
        var table = new Table({
            // head: ['ID', 'PRODUCT NAME', 'DEPARTMENT', 'PRICE', 'STOCK QUANTITY']
            head: [chalk.greenBright('ID'), chalk.greenBright('PRODUCT NAME'), chalk.greenBright('DEPARTMENT'), chalk.greenBright('PRICE'), chalk.greenBright('STOCK QUANTITY')]
        });
        for (var i = 0; i < result.length; i++) {
            table.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price.toFixed(2), result[i].stock_quantity]);
        }
        //Create table layout with items for sale
        console.log(table.toString());
        console.log("\n");
        promptUser();

    })
}


// Function to ask user if they would like to shop/continue to shop
function promptUser() {

    inquirer
        .prompt([
            {
                name: "option",
                type: "list",
                choices: ["Yes", "No"],
                message: chalk.yellowBright("Do you want to shop?"),
            },
        ])
        .then(function (userResponse) {

            console.log(userResponse.option);

            if (userResponse.option == "Yes") {
                // proceed with shopping
                buyItem();

            } else {
                console.log(chalk.magentaBright("\n************************************** Thank you! Visit again! ****************************\n"));
                // terminate process
                process.exit();
            }

        })

}


// Function to buy an item
function buyItem() {

    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: chalk.yellowBright("Enter the ID of the product that you would like to buy: "),
            },
            {
                name: "quantity",
                type: "input",
                message: chalk.yellowBright("Enter the # of units of products that you would like to buy: "),
            }
        ])
        .then(function (userResponse) {

            var userChosenItemID = userResponse.id;
            var quantityOrdered = userResponse.quantity;

            var query = "SELECT * FROM products";

            db.query(query, function (error, result) {

                for (var i = 0; i < result.length; i++) {
                    if (userChosenItemID == result[i].item_id) {
                        var productID = userChosenItemID;
                        var productName = result[i].product_name;
                        var departmentName = result[i].department_name;
                        var stockQuantity = result[i].stock_quantity;
                        var productPrice = result[i].price;
                        if (quantityOrdered > stockQuantity) {
                            console.log(chalk.magentaBright("\n*****************************************************************************************"));
                            console.log(chalk.redBright("*** Sorry, Insufficient quantity! Please change your order accordingly."));

                            var table = new Table({
                                head: [chalk.greenBright("ID"), chalk.greenBright("PRODUCT NAME"), chalk.greenBright("DEPARTMENT"), chalk.greenBright("PRICE"), chalk.greenBright("STOCK QUANTITY"), chalk.greenBright("QUANTITY ORDERED")]
                            });
                            table.push([productID, productName, departmentName, productPrice.toFixed(2), stockQuantity, quantityOrdered]);
                            console.log(table.toString());

                            console.log(chalk.magentaBright("******************************************************************************************\n"));
                            promptUser();

                        } else {
                            var newStockQuantity = stockQuantity - quantityOrdered;
                            var totalCost = quantityOrdered * productPrice;
                            db.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: newStockQuantity
                                    },
                                    {
                                        item_id: productID
                                    }
                                ],
                                function (error) {
                                    if (error) throw error;
                                    console.log(chalk.magentaBright("\n*****************************************************************************************"));
                                    console.log(chalk.yellowBright("\nYour order placed successfully! Please find your order details below:"));

                                    var table = new Table({
                                        head: [chalk.greenBright("ID"), chalk.greenBright("PRODUCT NAME"), chalk.greenBright("DEPARTMENT"), chalk.greenBright("PRICE"), chalk.greenBright("QUANTITY ORDERED"), chalk.greenBright("TOTAL COST")]
                                    });
                                    table.push([productID, productName, departmentName, productPrice.toFixed(2), quantityOrdered, totalCost.toFixed(2)]);
                                    console.log(table.toString());

                                    console.log(chalk.magentaBright("******************************************************************************************\n"));

                                }
                            );


                        }
                        promptUser();
                    }

                }

            })

        })

}