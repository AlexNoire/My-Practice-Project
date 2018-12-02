// var express = require("express"),
//     app = express(),
//     mongoose = require("mongoose"),
//     passport = require("passport"),
//     LocalStrategy = require("passport-local"),
//     User = require("./models/user");
    
    var express     = require("express"),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    User        = require("./models/user");
    
var url = process.env.DATABASEURL || "mongodb://localhost:27017/hello_world";
    
mongoose.connect(url, {useNewUrlParser:true});    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(require("express-session")({
    secret: "This is Branden's Secret Code",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("landing");
      }
      passport.authenticate("local")(req, res, function(){
          res.render("home");
      });
  });
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/home",
        failureRedirect: "/"
    }), function(req, res){
        console.log(req.user);
        
});

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/home", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});


app.get("/logout", function(req, res) {
   res.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("SecureCheckS Finder Has Started");
});


