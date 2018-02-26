

require("dotenv").config();

// load mysql npm package
var mysql = require("mysql");
// load inquirer npm package
var inquirer = require("inquirer");
// load chalk npm package
var chalk = require("chalk");

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
    // console.log("connected to the database");
    // display items for sale if database connection is successful
    displayItemsForSale();
})


// function to display items for sale
function displayItemsForSale() {
    console.log(chalk.magentaBright("\n****************** Welcome to Bamazon!!! ************************"));
    console.log(chalk.magentaBright("\n****************** Below are the items available for sale: ******\n"));

    db.query("SELECT * FROM products", function (error, result) {
        if (error) throw error;
        // log all items from database
        // console.log(result);
        console.log(chalk.greenBright("Item ID: " + "    || Product Name: " + "                              || Price: "));
        for (var i = 0; i < result.length; i++) {
            // console.log(chalk.yellowBright("Item ID: " + result[i].item_id + " || Product Name: " + result[i].product_name + " || Price: " + result[i].price));
            // console.log(chalk.yellowBright(result[i].item_id + "            || " + result[i].product_name + "                       || " + result[i].price));
            console.log(chalk.yellowBright(result[i].item_id + "            || " + result[i].product_name + "                                 || " + result[i].price));
        }
        console.log("\n");
        buyItem();
        // connection.end();
    })
}


// function to buy an item
function buyItem() {

    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: chalk.yellowBright("Enter the ID of the product that you would like to buy: "),
            },
            {
                name: "unit",
                type: "input",
                message: chalk.yellowBright("Enter the # of units of products that you would like to buy: "),
            }
        ])
        .then(function (userResponse) {

            var userChosenItemID = userResponse.id;
            var userChosenItemCount = userResponse.unit;
            // console.log("User selected Item ID: " + userChosenItemID);
            // console.log("# of units user selected: " + userChosenItemCount);

            var query = "SELECT * FROM products";

            db.query(query, function (error, result) {
                // console.log(result);

                for (var i = 0; i < result.length; i++) {
                    // console.log(result[i].item_id);
                    if (userChosenItemID == result[i].item_id) {
                        // console.log("Item exists");
                        var productName = result[i].product_name;
                        var stockQuantity = result[i].stock_quantity;
                        var productPrice = result[i].price;
                        // console.log("Product selected is: " + productName);
                        // console.log("Available quantity is: " + stockQuantity);
                        // console.log("Product price is: " + productPrice);
                        if (stockQuantity < userChosenItemCount) {
                            console.log(chalk.yellowBright("Sorry, Insufficient quantity!. Availabale quantity of the selected item " + productName + " is only " + stockQuantity + ". Please change your order accordingly."));
                        } else {
                            var newStockQuantity = stockQuantity - userChosenItemCount;
                            var totalCost = userChosenItemCount * productPrice;
                            console.log("Total cost is: " + totalCost);
                            console.log("Updated stock quantity is: " + newStockQuantity);
                            db.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: newStockQuantity
                                    },
                                    {
                                        item_id: userChosenItemID
                                    }
                                ],
                                function (error) {
                                    if (error) throw error;
                                    console.log(chalk.yellowBright("Order placed successfully! Your total cost is: " + totalCost));

                                }
                            );


                        }
                    }

                }

            })

        })
}