if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require("express");
const app = express();
const port = 8080;
const mongoose= require("mongoose");
const path=require("path");
const bodyparser=require("body-parser")
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const ExpressError= require("./utils/ExpressError.js");
const flash = require("connect-flash")
const passport = require("passport");
const LocalStratergy = require("passport-local")
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;
main()
.then( ()=> { 
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})

async function main(){
    mongoose.connect(dbUrl);
}

const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter = require("./routes/user.js");

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join("public"))); 
app.use(bodyparser.urlencoded({extended:true}));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET, 
    },
    touchAfter: 24 * 3600
})

store.on("error", () =>{
    console.log("ERROR in MONGO session store",err)
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httponly:true
    }
}

// app.get("/",(req,res) => {
    
//     res.send("Hello Bhai Log");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next) => {
   let {status=500,message="Something Went Wrong!"}=err;
   res.status(status).render("error.ejs",{message});
})

app.listen(port,()=> {
    console.log("Server Activated");
});