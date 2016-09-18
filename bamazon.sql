CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE Products (
	ItemID INTEGER(11) AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(50) NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Price INTEGER(11) NOT NULL,
    StockQuantity INTEGER(11) NOT NULL,
    PRIMARY KEY(ItemID)
);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ("2016 MacBook Pro", "Electronics", 1600, 100),
		("50-pack Crew Socks", "Apparel", 24.99, 100),
        ("2017 Honda Civic", "Automobiles", 19999, 10),
        ("2017 Audi A4", "Automobiles", 26000, 10),
        ("The Great Gatsby", "Books", 12.99, 200),
        ("2 Fast 2 Furious", "Movies", 13.99, 100),
        ("Mad Max: Fury Road", "Movies", 15.99, 100),
        ("USC Trojans Football Helmet", "Sports", 45.99, 50),
        ("Pepto Bismol", "Health", 5.99, 300),
        ("Advil", "Health", 4.99, 300),
        ("USED 2013 Dell XPS", "Electronics", 300, 20),
        ("iPhone 7", "Electronics", 799, 100);
        
        
