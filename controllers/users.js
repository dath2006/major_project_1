const User = require("../models/user.js");

module.exports.renderSignUpForm = async (req,res) => {
    res.render("users/signup.ejs")
};

module.exports.createUserSignUp = async (req,res,next) => {
    try{
    let {username,email,password}=req.body;
    const newUser =new User({email,username});
    const registerdUser= await User.register(newUser,password);
    req.login(registerdUser,(err)=>{
       if(err){
        return next(err);
       }else{
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
       }
    })
   
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm = async (req,res) => {
    res.render("users/login.ejs")
};

module.exports.userLogin = async (req,res)=>{
    req.flash("success","Wecome back to Wanderlust");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
    
};

module.exports.userLogout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }else{
            req.flash("success","You are loggeed Out Successfully");
            res.redirect("/listings");
        }
    })
};