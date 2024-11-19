const express = require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/ErrorHandling.js")
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingControllers=require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
 
router.get("/", wrapAsync(listingControllers.index));
router.post("/search",wrapAsync(listingControllers.search))
router.get("/category/:type",wrapAsync(listingControllers.categoryListing))
router.route("/new")
.get(isLoggedIn, listingControllers.renderNewForm)
.post(isLoggedIn,upload.single('image'),validateListing, wrapAsync(listingControllers.createListing));

router.route("/:id")
.get( wrapAsync(listingControllers.showListing))
.put(isLoggedIn,isOwner, upload.single('image'),validateListing,wrapAsync(listingControllers.updateListing ))
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControllers.renderEditListing));
 
module.exports = router;