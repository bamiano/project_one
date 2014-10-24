var db = require("./models/index");
var express = require("express"),
app = express();
require ("locus");
require ("locus");
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

db.User.create({})

app.get('/', function(req, res) {
var name = "Brent";
res.render ('index',{username:name});	
});

app.get('*', function(req, res) {
	res.render('404');
});

app.listen (3000, function (){
	console.log("Server starting on port 3000");
});
