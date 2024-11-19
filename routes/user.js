const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/ErrorHandling.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers= require("../controllers/users.js");

router.route("/signup")
.get( userControllers.renderSignUpForm)
.post(wrapAsync(userControllers.createUserSignUp));

router.route("/login")
.get( userControllers.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.userLogin);

router.get("/logout",userControllers.userLogout);

module.exports= router;