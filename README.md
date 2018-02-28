# Bamazon

Bamazon is a simple e-commerce app. It connects to a mysql database to store and retrieve product and department information.

## Technologies Used:

* `Node.js`
* `MySQL`
* `JavaScript`

### Node Packages:

The [package.json](https://github.com/anishbnair/Bamazon/blob/master/package.json){:target="_blank"} lists dependent node packages, but for your convenvice, these are the ones to install.

* [Inquirer](https://www.npmjs.com/package/inquirer){:target="_blank"}
    - `npm install inquirer`

* [mysql](https://www.npmjs.com/package/mysql){:target="_blank"}
    - `npm install mysql`

* [Chalk](https://www.npmjs.com/package/chalk){:target="_blank"}
    - `npm install chalk`

* [dotenv](https://www.npmjs.com/package/dotenv){:target="_blank"}
    - `npm install dotenv --save`

* [cli-table](https://www.npmjs.com/package/cli-table){:target="_blank"}
    - `npm install cli-table`

## Customer View:

The customer module lets users select a product to purchase, enter the number of items they wish to purchase, and then complete the purchase.

Once the customer has placed the order, application will check if the store has enough of the product to meet the customer's request. If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through. However, if the store does have enough of the product, application will fulfill the customer's order. This means updating the SQL database to reflect the remaining quantity. Once the update goes through, app shows the customer the total cost of their purchase.

### Getting Started:

* To run this module in the terminal:
`node bamazonCustomer.js`

### Screenshots:
#### Sucessful Transaction:
![Bamazon](/images/customerView_Success.png)
#### Insuffient Quantity:
![Bamazon](/images/customerView_Fail.png)