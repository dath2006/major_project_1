const express = require("express");
const router= express.Router({mergeParams:true});

router.get("/privacy",(req,res)=>{
    res.render("details/privacy.ejs");
}
)

router.get("/terms",(req,res)=>{
    res.render("details/terms.ejs");
})

router.get("/companydetails",(req,res)=>{
    res.render("details/company.ejs")
})

module.exports = router;