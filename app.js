var express = require('express'),
	ejs = require('ejs'),
	request = require('request'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require('path'),
	mongoose = require('mongoose'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user")
	app = express()

// CONNECT LOCAL MONGOOSE DATABASE
mongoose.connect("mongodb://localhost:27017/essayEveryday", {useNewUrlParser: true});

// settings for hashing passwords
app.use(require("express-session")({
	secret: "Mayank Chauhan made essay everyday",
    resave: false,
    saveUninitialized: false
}));

// include passport to my app
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// static files path
app.use(express.static(path.join(__dirname, 'vendor')));

// set my view engine i.e what i will use for templating
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res){
	res.render("index");
});

app.get("/login", function(req,res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
		successRedirect: "/write",
		failureRedirect: "/login"
	}), function(req,res){
});	

app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/write"); 
        });
    });
});

app.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});

app.get('/write',isLoggedIn, function(req,res){
	// if authenticated show write
	// else login
	res.render("write");
});


// as we want to check isLoggedIn at multiple pages sp we make
// a separate function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(req,res){
	console.log('App on 3000');
});