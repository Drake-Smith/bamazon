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
	homeScreen();
})

var howManyProducts = 0;

console.log("");
console.log("**********************************************");
console.log("            BAMazon Executive Portal          ");
console.log("**********************************************");
console.log("");

var homeScreen = function(){  //prompts if you want to make another order
	inquirer.prompt([{
		name: "options",
		type: "list",
		message: "Menu",
		choices: [
			"View Product Sales by Department",
			"Create New Department", 
			"Exit"
		]
	}]).then(function(answer) {
		switch(answer.options){
			case "View Product Sales by Department":
				viewSales();
			break;

			case "Create New Department":
				addDepartment();
			break;

			case "Exit":
				console.log("Goodbye.");
				process.exit();
			break;
		}
	})
}

var viewSales = function() {
	connection.query('SELECT * FROM Departments' , function(err, res) {
		if (err) throw err;
		var deptArr = []; //will be array containing the table data
		//howManyProducts = res.length;
		for (var i = 0; i < res.length; i++){ //push data into the productsArr
			var profit = parseInt(res[i].TotalSales) - parseInt(res[i].OverheadCosts);
			deptArr.push([res[i].DepartmentID, res[i].DepartmentName, "$" + res[i].OverheadCosts, "$" + res[i].TotalSales, profit]);
		}
		console.log("");
		console.table(['DepartmentID', 'Department', 'Overhead Costs', 'Total Sales', "Total Profit"], deptArr); //populate the table 
		homeScreen();
	})

}

var addDepartment = function() {
	    inquirer.prompt([{
        name: "dept",
        type: "input",
        message: "Department Name:"
    }, {
        name: "overhead",
        type: "input",
        message: "Overhead Cost:",
		validate: function(value) {
            if (isNaN(value) == true || parseInt(value) < 0) {
                return false;
            } else {
                return true;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO Departments SET ?", {
            DepartmentName: answer.dept,
            OverheadCosts: answer.overhead,
        }, function(err, res) {
        	console.log("****************************");
            console.log("Department successfully added.");
            console.log("****************************");
            homeScreen();
        });
    })
}