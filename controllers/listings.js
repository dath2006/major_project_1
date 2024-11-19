const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res) => {
    await  Listing.find({})
     .then(result => {res.render("listings/listings.ejs",{result});})
     
 };

module.exports.search = async(req,res) =>{
    let {search} = req.body;
    search=search.charAt(0).toUpperCase()+search.slice(1);
    let result = await Listing.find({$or: [{location:search},{country:search}]});
    res.render("listings/listings.ejs",{result});
}

module.exports.categoryListing = async(req,res) => {
    let {type}=req.params;
    let result = await Listing.find({category:type});
    res.render("listings/category.ejs",{result});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs"); 
 };

module.exports.showListing = async(req,res) => {
    let {id} = req.params; 
   await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner").then(result => {
       if(!result){
           req.flash("error","Listing you requested does not exist");
           res.redirect("/listings") ;
       }else{
           res.render("listings/show.ejs",{result});
       }
       
    });
};

module.exports.createListing = async(req,res) => {
     let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send();
    let url = req.file.path;
    let fileName= req.file.filename;
    let data = req.body;
    let newList = new Listing(data);
    newList.owner = req.user._id; 
    newList.image = {fileName,url};
    newList.geometry = response.body.features[0].geometry;
    newList.category = req.body.category;
    await newList.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditListing = async (req,res) => {
    let {id} = req.params;
   await Listing.findById(id).then(result => {
       if(!result){
           req.flash("error","Listing you requested does not exist");
          return res.redirect("/listings") ;
       }
       originalImageUrl = result.image.url;
       originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
       res.render("listings/edit.ejs",{result,originalImageUrl});
       
        
    });
   
};

module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let listing= await Listing.findByIdAndUpdate(id,req.body);
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let fileName= req.file.filename;
        listing.image = {fileName,url};
        await listing.save();
    }
       req.flash("success","Listing Updated Successfully");
       res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
};