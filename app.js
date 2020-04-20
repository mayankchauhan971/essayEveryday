var express = require('express'),
	ejs = require('ejs'),
	request = require('request'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
    path = require('path'),
    cookieParser = require("cookie-parser"),
	mongoose = require('mongoose'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user"),
    Article = require("./models/article"),
	app = express()

// CONNECT LOCAL MONGOOSE DATABASE

app.set('port', (process.env.PORT || 3000));
// mongoose.connect("mongodb://localhost:27017/essayEveryday", {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://mayankchauhan971:essayeveryday@essayeveryday-vf1bi.mongodb.net/test?retryWrites=true&w=majority",
// 	{
// 		useNewUrlParser: true
// 	});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('secret'));

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

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

// set my view engine i.e what i will use for templating
app.set('view engine', 'ejs');


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

app.get('/write', isLoggedIn,  function(req,res){
	// if authenticated show write
	// else login
	res.render("write", {login: req.user});
});

app.get('/my-essay', isLoggedIn, (req, res) => {
// //that is the id of the current logged in user
  // const userId = ;

  // query article with field of user equals to
  // current logged-in user
  Article.find({ user: req.user._id })
    .then((articles) => {
       res.render('my-essay', { articles })
    })
    .catch(function (err) {
            res.send(err.message);	
        })  
});


app.get('/my-essay/:id', isLoggedIn,  function (req,res) {
    Article.findById(req.params.id)
        .then(function (article) {
            res.render("show-essay", {
                data: {
                    articleId: article._id,
                    title: article.title,
                    content: JSON.stringify(article.content)
                }
            });
            // res.render("Hey");
        })
        .catch(function (err) {
            res.send(err.message);	
        }) 
});


// Render edit page
app.get('/my-essay/:id/edit', isLoggedIn, function(req,res){
    Article.findById(req.params.id)
        .then(function (article) {
            res.render("edit-essay", {
                data: {
                    articleId: article._id,
                    title: article.title,
                    content: JSON.stringify(article.content)
                }
            });        
        })
        .catch(function (err) {
            res.send(err.message);	
        })    
});





// Handle ajax request from client
// This one to create new article
app.post('/write', function (req, res) {
    // get input from request body
    var content = req.body.content;
    var title =req.body.title;
    
    // check if user input is present
    var errors = [];
    if (!content) {
        errors.push({
            content: '`content` is required',
        })
    }

    if (!title) {
        errors.push({
            title: '`title` is required',
        })
    }
    
    // if there is any error,  return response with errors
    if (errors.length) {
        return res.status(422).json({
            errors: errors
        })
    }
    
    // prepare data for db persisting
    var data = {
       user: req.user._id, // object id of user currently logged in,
       title: title,
       content: content
    }

     Article.create(data)
        .then(function (newArticle) {
            // send json response to client
            res.json({ newArticle: newArticle })
        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message,
            });
        })

});

// For updating existing essay
app.put('/essay/:id', function (request, response) {
    var articleId = request.params.id;
    var content = request.body.content;
    var title =request.body.title;


    Article.findById(articleId)
        .then(function (article) {
            if (!article) return response.status(404).json({
                message: "Cant find article"
            })

            article.title = title;
            article.content = content;

            return article.save();
        })
        .then((data) => {
            response.json({
               article: data
            })
        })
        .catch(function(err){
	      res.send(err.message);	
	    })
});


// as we want to check at multiple pages sp we make
// a separate function
function isLoggedIn(req, res, next){
    // if(req.isAuthenticated()){
        return next();
    // }
    res.redirect("/login");
}


// app.listen(3000, function(req,res){
// 	console.log('App on 3000');
// });



Promise.resolve()
  .then(() => {
   //  mongoose.connect("mongodb+srv://mayankchauhan:essayeveryday@essayeveryday-vf1bi.mongodb.net/test?retryWrites=true&w=majority", {
		 //  useNewUrlParser: true
	  // });

	  mongoose.connect("mongodb://localhost:27017/essayEveryday", {useNewUrlParser: true});

  })
  .then(() => {
    app.listen(app.get("port"), function(){
      console.log("running server on port");
    });
  });