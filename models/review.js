const mongoose=require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating : {
        type : Number,
        max :5,min:1
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Review",reviewSchema);