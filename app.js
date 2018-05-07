var dbCredentials = require('./credentials');

//Set up requirements
var express = require("express");

//Create an 'express' object
var app = express();
var Request = require('request');
var bodyParser = require('body-parser');

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


//******* DATABASE Configuration *******
// The username you use to log in to cloudant.com
var CLOUDANT_USERNAME=dbCredentials.CLOUDANT_USERNAME;
// The name of your database
var CLOUDANT_DATABASE=dbCredentials.CLOUDANT_DATABASE;
// These two are generated from your Cloudant dashboard of the above database.
var CLOUDANT_KEY=dbCredentials.CLOUDANT_KEY;;
var CLOUDANT_PASSWORD=dbCredentials.CLOUDANT_PASSWORD;

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;


/*-----
ROUTES
-----*/

//Main Page Route - yay
app.get("/", function(req, res){
	res.render('index');
});

app.get("/index.html", function(req, res){
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
	res.send('Sorry, nothing here.');
});


// POST - route to create a new note.
app.post("/savecontact", function (request, response) {
	// Use the Request lib to POST the data to the CouchDB on Cloudant
	Request.post({
		url: CLOUDANT_URL,
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true,
		body: request.body
	},
	function (err, res, body) {
		if (!err && res.statusCode == 201){
			console.log('Doc was saved!');
			response.json(body);
		}
		else{
			//console.log('Error: '+ res.statusCode);
			console.log(err)
			console.log(body);
		}
	});
});




// Start the server
app.listen(3000);
console.log('Express started on port 3000');
