const Listing=require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {review}=req.body;
    let newReview = new Review({
        comment: review.comment,
        rating: review.rating
    });
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Saved Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req,res)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : rid}})
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
};