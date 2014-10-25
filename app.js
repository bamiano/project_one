var db = require("./models/index");
var express = require("express"),
	bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  session = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
	app = express();
	require ("locus");
	app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// db.User.create({})

app.get('/', function(req, res) {
	res.render ('home');	
});

app.get('/login', function(req, res){
	res.render ('login');
});

app.get('/signup', function(req, res){
	res.render ('signup');
});

app.get('*', function(req, res) {
	res.render('404');
});

app.listen (3000, function (){
	console.log("Server starting on port 3000");
});
