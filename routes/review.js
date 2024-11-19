const express = require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/ErrorHandling.js")
const Review = require("../models/review.js")
const {validateReview,isLoggedIn,isAuthor} = require("../middleware.js")
const Listing=require("../models/listing");
const reviewControllers = require("../controllers/reviews.js");

//post review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewControllers.createReview));

router.delete("/:rid",isLoggedIn,isAuthor,wrapAsync(reviewControllers.deleteReview));

module.exports=router;