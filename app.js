//Set up requirements
var express = require("express");

//Create an 'express' object
var app = express();

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));

/*-----
ROUTES
-----*/

//Main Page Route - NO data
app.get("/", function(req, res){
	var dataForThePage = {
		message: "Try adding a forward slash plus a word to the url",
		search: false
	};
	res.render('index', dataForThePage);
});

//Main Page Route - WITH data requested via the client
app.get("/:word", function(req, res){
	var currentWord = req.params.word;
	var dataForThePage = {
		message: currentWord,
		search: true
	};
	res.render('index', dataForThePage);
});

//Catch All Route
app.get("*", function(req, res){
	res.send('Sorry, nothing doing here.');
});

// Start the server
app.listen(3000);
console.log('Express started on port 3000');