var db = require("./models/index");
var express = require("express"),
	bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  session = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
  nodemailer = require('nodemailer'),
	app = express();
	require ("locus");
	var morgan = require('morgan');
  var routeMiddleware = require("./config/routes");
  var request = require("request");
	

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));

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

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
});

app.get('/', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('index');
});

// test code to create a target and crime model  
// db.Target.create({name: "Brent Amiano", age: 28});
// db.Crime.create({coordinates: 12345.67, crime_type: "ARSON", date_time: 

app.post('/search', function(req, res){

  db.Target.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    UserId: req.body.UserId
  }).done(function(err,target){
    console.log("SOMETHING GO WRONG?",err);
    // console.log(target)

  
// Build the URL that we're going to call.
  var url = "http://sanfrancisco.crimespotting.org/crime-data?format=json&count=50";
// Call the SFPD API searching for the crime.
  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	// JSON.parse turns a string into an object
  	var obj = JSON.parse(body);
    // res.send(obj.Search); 
    res.render("search.ejs", {TargetId: target.id, crimeData: obj.features});
  	}
	});
});
});

// app.post('/targets', routeMiddleware.preventLoginSignup, function(req, res) {
//   var target = req.body.;
//   new Target(name, age);
//   res.redirect('/targets'); 
// });

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('signup', { username: ""});
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('login', {message: req.flash('loginMessage'), username: ""});
});

app.get('/home', routeMiddleware.checkAuthentication, function(req,res){
  res.render("home", {user: req.user});
});

// on submit, create a new user using form values
app.post('/submit', function(req,res){

  db.User.createNewUser(req.body.username, req.body.password,
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  },
  function(success){
    res.render("index", {message: success.message});
  });
});

// this route adds a crime for a user
app.post('/addcrime', function(req,res){

  var url = "http://sanfrancisco.crimespotting.org/crime-data?format=json&count=50";

// Call the SFPD API searching for the crime.
  var caseNumber = req.body.id
  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var obj = JSON.parse(body);
    obj.features.forEach(function(crime){
      if (crime.id == caseNumber) {
        db.Crime.create({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        crime_type: crime.properties.crime_type,
        date_time: crime.properties.date_time,
        description: crime.properties.description,
        case_number: crime.properties.case_number,
        TargetId: req.body.TargetId,
        }).done(function(err,crime){
          db.Target.find(req.body.TargetId).done(function(err,target){
            res.redirect('/targets');  
          })
          
        });
      }
      // if(crime req.body.id)
    });
    // res.send(obj.Search); 
    // res.render("search.ejs", {crimeData: obj.features});
    // we passed data to our templates by adding a second object. objects have to be key value pairs. 
    }
  });
});

app.get('/targets', routeMiddleware.checkAuthentication, function(req,res){
  db.User.find(req.user.id).done(function(err,user){
    user.getTargets().done(function(err,targets){
      res.render('targets',{targets:targets});
    });
  });
});

app.get('/crime/:id',routeMiddleware.checkAuthentication,function(req,res){
  db.Target.find(req.params.id).done(function(err,target){
    target.getCrimes().done(function(err,crimes){
      res.render('crimes',{crimes:crimes});
    });
  });
});

app.post('/sendmail/:id', function(req,res){
  db.Target.find(req.params.id).done(function(err,target){
    target.getCrimes().done(function(err, crimes){
      console.log("all my crimes", crimes);
      var email = target.email;
      var crime = crimes[0];
      
      var name = target.name;
      var age = target.age;
      

      var mailOptions = {
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: 'SFPD Automated Notification Delivery System', // Subject line
        text: 'This message has been automatically generated by the San Francisco Police Department.  ' + name + ', ' + age + ' years old, has been arrested and charged with ' + crime.crime_type + '  He/She has requested that you post his bond at the San Francisco County Jail located at 425 7th St.  He may be reached between the hours of 7:00pm and 9:00pm by calling (415) 575-4410 and selecting option 2.  Please note all calls are monitored for security purposes.'

      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
          res.redirect('/targets');
        }
      });
    });
  });
});


// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', routeMiddleware.checkAuthentication, function(req,res){
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