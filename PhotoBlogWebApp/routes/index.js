var express =require("express");
var router =express.Router();
var passport=require("passport");
var User=require("../models/user");


router.get("/", function(req,res){
    res.render("intro");
});

router.get("/signup",function(req,res){
    res.render("signup");
});



router.post("/signup",function(req,res){
    var newUser = new User({username:req.body.username});
    
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/signup");
        }
       passport.authenticate("local")(req,res, function(){
             req.flash("success","Welcome! "+ user.username);
            res.redirect("/images");
       });
    });
});




router.get("/signin",function(req,res){
    res.render("signin");
});


router.post("/signin",passport.authenticate("local",{
    successRedirect:"/images",
    failureRedirect:"/signin"
    }), function(req,res){
});


router.get("/signout",function(req,res){
    req.logout();
    req.flash("success","Just signed out!");
    res.redirect("/images");
});


module.exports =router;
