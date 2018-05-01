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

//Main Page Route - yay
app.get("/", function(req, res){
	res.render('index');
});

app.get("/our_story", function(req, res){
	res.render('ourstory.html');
});

app.get("/community", function(req, res){
	res.render('community.html');
});

app.get("/resources", function(req, res){
	res.render('resources.html');
});

app.get("/events", function(req, res){
	res.render('events.html');
});

app.get("/contact", function(req, res){
	res.render('contact.html');
});

//Catch All Route
app.get("*", function(req, res){
	res.send('Sorry, nothing doing here.');
});

// Start the server
app.listen(3000);
console.log('Express started on port 3000');