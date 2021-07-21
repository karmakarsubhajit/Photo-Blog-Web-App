var express =require('express');
var app=express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var passport =require('passport');
var LocalStrategy=require('passport-local');
var methodOverride = require("method-override");
var flash=require('connect-flash');

var Image=require("./models/image");
var Comment=require("./models/comment");



var imageRoutes =require("./routes/images");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

var User =require("./models/user");
const { route } = require('./routes/comments');



var db_url = process.env.DB_URL || "mongodb://localhost/photo_blog"
var port = process.env.PORT || "3000"


mongoose.connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    });

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());



app.locals.moment = require('moment');

app.use(require("express-session")({
    secret:"hkasddsakjd",
    resave:false,
    saveUninitialized:false
})) ;

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success"); 
    next();
});



app.use(indexRoutes);
app.use("/images",imageRoutes);
app.use("/images/:id/comments",commentRoutes);


app.listen(port, process.env.IP);
