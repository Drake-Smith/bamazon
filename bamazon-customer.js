
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

console.log("");
console.log("********************************************************************");
console.log("            Welcome to BAMazon, your online marketplace!");
console.log("         Here are all of our products available for purchase.");
console.log("********************************************************************");
console.log("");

var howManyProducts = 0;


var displayTable = function(){
	connection.query('SELECT * FROM Products' , function(err, res) {
		if (err) throw err;
		var productsArr = []; //will be array containing the table data
		howManyProducts = res.length;
		for (var i = 0; i < res.length; i++){ //push data into the productsArr
			productsArr.push([res[i].ProductName, "$" + res[i].Price, res[i].ItemID, res[i].StockQuantity]);
		}
		console.table(['Product', 'Price', 'ID', "Quantity"], productsArr); //populate the table 
		orderPage();
	})
}

var orderPage = function(){
	inquirer.prompt([{
		name: "id",
		type: "input",
		message: "What is the ID of the product you wish to purchase?",
		validate: function(value) {
			//validation checks ID number to see if it exists
			if (parseInt(value) > howManyProducts || isNaN(value) == true){ 
				return false;
			} else {
				return true;
			}
		}
	}, {
		name: "quantity",
		type: "input",
		message: "How many units of the product do you wish to purchase?",
		validate: function(value) {
			if (isNaN(value) == true) { //validation
				return false;
			} else {
				return true;
			}
		}
	}]).then(function(answer) {
			connection.query('SELECT * FROM Products WHERE ItemID = ?', [answer.id], function(err, res) {
				//console.log("The ID number of the product is: " + res[0].ItemID);
				//console.log("You want " + answer.quantity + " units.");
				//console.log("The quantity of that proudct is: " + res[0].StockQuantity + " remaining.");

				if (answer.quantity > res[0].StockQuantity) {
					console.log("Insufficient quantity in stock. Select fewer units or a different product.");
					orderPage(); //bring you back to order screen
				} else {
					//processOrder(res[0].ItemID, res[0].StockQuantity);
					var stockLeft = res[0].StockQuantity - answer.quantity; //how many units are left after order
						// connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: stockLeft}, {ItemID: answer.id}], function(err, res) {
						// 	console.log("Order processed.");
						// 	console.log("There are now " + stockLeft + " units left.");
						processOrder(answer.id, stockLeft);
						calculatePrice(answer.id, answer.quantity);
						// })
				}
			})
		})
};

var processOrder = function(id, quantity){  //updates stock unit amount in MySQL
	connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: quantity}, {ItemID: id}], function(err, res) {
		//console.log("There are now " + quantity + " units left.");
	})	
}

var calculatePrice = function(id, quantity){  //determines the total cost of purchase
	connection.query('SELECT * FROM Products WHERE ItemID = ?', [id], function(err, res) {
		var orderTotal = quantity * res[0].Price;
		console.log("**********************************************");
		console.log("Here are your order details.");
		console.log("Order: " + res[0].ProductName);
		console.log("Units: " + quantity);
		console.log("Total Cost: $" + orderTotal);
		console.log("**********************************************");
		orderAgain();
	})		
}

var orderAgain = function(){  //prompts if you want to make another order
	inquirer.prompt([{
		name: "orderAgain",
		type: "list",
		message: "Order again?",
		choices: ["Yes", "No"]
	}]).then(function(answer) {
		if (answer.orderAgain == "Yes"){
			displayTable(); //call table function again and restart process
		} else {
			console.log("Goodbye.");
			process.exit(); //exit out of program
		}
	})
}

displayTable(); //starts the program  

