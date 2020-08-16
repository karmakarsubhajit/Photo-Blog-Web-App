var express =require("express");
var router =express.Router();
var Image =require("../models/image");



router.get("/", function(req,res){
  
     Image.find({},function(err,allImages){
         if(err){
             console.log(err);
         }
         else{
             res.render("images/index",{images:allImages});
         }
     });
 });
 
 router.post("/", SignInCheck, function(req,res){
    
     var name= req.body.name;
     var image = req.body.image;
     var desc=req.body.description;
     var author={
         id:req.user._id,
         username:req.user.username
     }
     var newImage={name:name, image:image,description:desc, author:author};
    
     Image.create(newImage, function(err,newlyCreated){
         if(err){
             console.log(err);
         }
         else{
             res.redirect("/images");
         }
     });
     
 });
 
 router.get("/new", SignInCheck, function(req,res){
     res.render("images/new");
 });
 
 
 router.get("/:id", function(req,res){
 
     var curid = req.params.id; curid = curid.replace(/\s/g,'');
     Image.findById(curid).populate("comments").exec(function(err, foundImage){
         if(err){
             console.log(err);
         }
         else{
             res.render("images/show",{image:foundImage});
         }
     });  
 });


router.get("/:id/edit", checkImageAuthorization, function(req,res){
    var curid = req.params.id; curid = curid.replace(/\s/g,'');
        Image.findById(curid,function(err,foundImage)
        {    
           
             res.render("images/edit",{image:foundImage});    
        });
});


router.put("/:id", checkImageAuthorization, function(req,res){
    var curid = req.params.id; curid = curid.replace(/\s/g,'');
    
    Image.findByIdAndUpdate(curid,req.body.image, function(err, updatedImage){
        if(err){
            res.redirect("/images");
        }
        else{
            res.redirect("/images/"+curid);
        }

    });
});


router.delete("/:id", checkImageAuthorization, function(req,res){
    var curid = req.params.id; curid = curid.replace(/\s/g,'');
   Image.findByIdAndRemove(curid, function(err){
        if(err){
            res.redirect("/images");
        }
        else{
            res.redirect("/images");
        }
    });
});



function SignInCheck(req,res,next)
 {
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/signin");
 }
 

 function checkImageAuthorization(req,res,next){
    var curid = req.params.id; curid = curid.replace(/\s/g,'');
   
    if(req.isAuthenticated()){

        Image.findById(curid,function(err,foundImage){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundImage.author.id.equals(req.user._id))
                {
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
    
        });

    }
    else{
        res.redirect("back");
    }
 }


 module.exports =router;