
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
	displayTable(); //starts the program  
})

console.log("");
console.log("********************************************************************");
console.log("            Welcome to BAMazon, your online marketplace!");
console.log("         Here are all of our products available for purchase.");
console.log("********************************************************************");
console.log("");

var howMany;
var displayTable = function(){
	connection.query('SELECT * FROM Products' , function(err, res) {
		if (err) throw err;
		var productsArr = []; //empty array which will contain the table data
		howMany = res.length;  //assign num of products to var howMany for validation later
		for (var i = 0; i < res.length; i++){ //push data into the productsArr
			productsArr.push([ res[i].ItemID, res[i].ProductName, res[i].DepartmentName, "$" + res[i].Price]);
		}
		console.table(['ID', 'Product', 'Department', 'Price'], productsArr); //populate the table 
		orderPage(howMany);
	})
}

var orderPage = function(num){
	inquirer.prompt([{
		name: "id",
		type: "input",
		message: "What is the ID of the product you wish to purchase?",
		validate: function(value) {
			//validation checks ID number to see if it exists
			if (parseInt(value) >  num || parseInt(value) < 1 || isNaN(value) == true){  //makes sure input is valid
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
			if (isNaN(value) == true || parseInt(value) <= 0) { //validation
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
					orderPage(num); //brings you back to order screen
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
		addCostToDB(orderTotal, res[0].DepartmentName);

		console.log("**********************************************");
		console.log("Here are your order details.");
		console.log("Order: " + res[0].ProductName);
		console.log("Units: " + quantity);
		console.log("Total Cost: $" + orderTotal);
		console.log("**********************************************");
		orderAgain();
	})		
}

var addCostToDB = function(total, department) {  
	connection.query('SELECT * FROM Departments WHERE DepartmentName = ?', [department], function(err, res) { //finds sales info by department
		var updateSales = parseInt(total) + parseInt(res[0].TotalSales);
		//console.log("COST TO DB: " + updateSales);
		connection.query('UPDATE Departments SET ? WHERE ?', [{TotalSales: updateSales}, {DepartmentName: department}], function(err, res) { //updates the total sales with new amount
		})
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



