const mongoose= require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then( ()=> { 
    console.log("Connected to DB");
    
}).catch(err => {
    console.log(err);
})

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async function (){
  await Listing.deleteMany({});  
  initData.data = initData.data.map((obj)=> ({...obj,owner:"672f4ca333d897bf512ee45b"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialised");
};

initDB();