var express =require("express");
var router =express.Router({mergeParams: true});
var Image= require("../models/image");
var Comment =require("../models/comment");


router.get("/new",SignInCheck,function(req,res){
    
    var curid = req.params.id; curid = curid.replace(/\s/g,'');
    Image.findById(curid,function(err,image){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{image:image});
        }
    });   
});

router.post("/",function(req,res){
    var curid = req.params.id; curid = curid.replace(/\s/g,'');
    Image.findById(curid,function(err,image){
        if(err){
            console.log(err);
            res.redirect("/images");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong.");
                    console.log(err);
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();

                 
                    image.comments.push(comment);
                    image.save();
                    req.flash("success","Added Comment!");
                    res.redirect('/images/'+image._id);
                }
            });
        }
    });
});


router.delete("/:comment_id", checkCommentAuthorization, function(req,res){
    var curid = req.params.comment_id; curid = curid.replace(/\s/g,'');
        Comment.findByIdAndRemove(curid,function(err){
            if(err){
                res.redirect("back");
            }
            else{
                req.flash("success","Comment removed!");
                res.redirect("back");
            }
        });
});


function checkCommentAuthorization(req,res,next){
    var curid = req.params.comment_id; curid = curid.replace(/\s/g,'');
   
    if(req.isAuthenticated()){

        Comment.findById(curid,function(err,foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id))
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

function SignInCheck(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
}



module.exports = router;