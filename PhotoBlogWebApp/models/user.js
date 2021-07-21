var mongoose = require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');
const passport = require('passport');

var UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);
