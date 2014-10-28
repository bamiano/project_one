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
	var morgan = require('morgan');
  var routeMiddleware = require("./config/routes");
  var request = require("request");
	

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));

// db.User.create({})

app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  // this is in milliseconds
  maxage: 3600000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.User.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){
      done(error, user);
    });
});
app.get('/', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('index');
});

app.get('/search', function(req, res){
	// console.log("TARGET", req.query.targetName);
	// this is how we grab information from the submit form
	// the req is what is coming in. express is taking care of the .query .movieTitle is where we are pulling the information from
	// Grab the movie title from the URL query string.
	// var searchTerm = req.query.crimeData;
  
  
// Build the URL that we're going to call.
  var url = "http://sanfrancisco.crimespotting.org/crime-data?format=json&count=50";
// Call the SFPD API searching for the crime.
  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	// JSON.parse turns a string into an object
  	var obj = JSON.parse(body);
    // res.send(obj.Search); 
    res.render("search.ejs", {crimeData: obj.features});
    // we passed data to our templates by adding a second object. objects have to be key value pairs. 
  	}
	});
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('signup', { username: ""});
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('login', {message: req.flash('loginMessage'), username: ""});
});

app.get('/home', routeMiddleware.checkAuthentication, function(req,res){
  res.render("home", {user: req.user});
});

// on submit, create a new users using form values
app.post('/submit', function(req,res){

  db.User.createNewUser(req.body.username, req.body.password,
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  },
  function(success){
    res.render("index", {message: success.message});
  });
});

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});

// catch-all for 404 errors
app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});


app.listen(3000, function(){
  console.log("Listening on local host 3000");
});