var table = require('console.table'); //console.table will populate table of Bamazon products
var inquirer = require('inquirer'); //initialize inquirer
var mysql = require('mysql'); //initiliaze mysql

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "bamazonDB"
})
connection.connect(function(err) {
	if (err) throw err;
})
var howManyProducts = 0;

console.log("");
console.log("**********************************************");
console.log("            BAMazon Manager Portal            ");
console.log("**********************************************");
console.log("");

var homeScreen = function(){  //prompts if you want to make another order
	inquirer.prompt([{
		name: "options",
		type: "list",
		message: "Menu",
		choices: [
			"View Products for Sale",
			"View Low Inventory", 
			"Add to Inventory", 
			"Add New Product",
			"Exit"
		]
	}]).then(function(answer) {
		switch(answer.options){
			case "View Products for Sale":
				//viewProducts();
				displayTable();
				homeScreen();
			break;

			case "View Low Inventory":
				viewInventory();
			break;

			case "Add to Inventory":
				addInventory();
			break;

			case "Add New Product":
				addProduct();
			break;

			case "Exit":
				console.log("Goodbye.");
				process.exit();
			break;
		}
	})
}

var displayTable = function() {
	connection.query('SELECT * FROM Products' , function(err, res) {
		if (err) throw err;
		var productsArr = []; //will be array containing the table data
		howManyProducts = res.length;
		for (var i = 0; i < res.length; i++){ //push data into the productsArr
			productsArr.push([res[i].ProductName, "$" + res[i].Price, res[i].ItemID, res[i].StockQuantity]);
		}
		console.log("");
		console.table(['Product', 'Price', 'ID', "Quantity"], productsArr); //populate the table 
	})
}

var viewProducts = function() { //view table of all the products
	// connection.query('SELECT * FROM Products' , function(err, res) {
	// 	if (err) throw err;
	// 	var productsArr = []; //will be array containing the table data
	// 	howManyProducts = res.length;
	// 	for (var i = 0; i < res.length; i++){ //push data into the productsArr
	// 		productsArr.push([res[i].ProductName, "$" + res[i].Price, res[i].ItemID, res[i].StockQuantity]);
	// 	}
	// 	console.log("");
	// 	console.table(['Product', 'Price', 'ID', "Quantity"], productsArr); //populate the table 
	// 	homeScreen();
	// })
	displayTable();
	homeScreen();
}

var viewInventory = function() {
	connection.query('SELECT * FROM Products WHERE StockQuantity < 20', function(err, res) {
		if (err) throw err;
		var lowInventory = [];
		for (var i = 0; i < res.length; i++){
			lowInventory.push([res[i].ProductName, res[i].StockQuantity]);
		}
		console.log("");
		console.table(['Product', 'Stock Remaining'], lowInventory);
		homeScreen();
	})
}

var addInventory = function() {
	displayTable();

	inquirer.prompt([{
		name: "id",
		type: "input",
		message: "Add inventory to which item? (input Item ID)",
		validate: function(value) {
			//validation checks ID number to see if it exists
			if (parseInt(value) > howManyProducts || isNaN(value) == true){ 
				return false;
			} else {
				return true;
			}
		}
	}]).then(function(answer) {
		console.log("Ballsack");
	})
}

var addProduct = function() {

}

homeScreen();