const mongoose=require("mongoose");
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        // required:true
    },
    description:{
        type:String
    },
    image:{
        filename: String,
        url: String,
       
    },
    category:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        // required:true
    },
    country:{
        type:String
    },

    reviews : [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
         
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },

   

});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;