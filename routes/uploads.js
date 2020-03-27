var express = require("express");
var router  = express.Router();
var Upload = require("../models/upload");
var middleware = require("../middleware");

//INDEX - show all uploads
router.get("/", middleware.isLoggedIn,function(req, res){
    // Get all uploads from DB
    let uname=req.user.username;
    let uid=req.user._id;
    Upload.find({"owner":{"id":uid,"username":uname}}, function(err, allUploads){
       if(err){
           console.log(err);
       } else {
          res.render("uploads/index",{uploads:allUploads});
       }
    });
});

//CREATE - add new upload to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to uploads array
    var name = req.body.name;
    var url = req.body.url;
    var desc = req.body.description;
    var owner = {
        id: req.user._id,
        username: req.user.username
    }
    var newUpload = {name: name, url: url, description: desc, owner: owner}
    // Create a new upload and save to DB
    Upload.create(newUpload, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to uploads page
            res.redirect("/api/media");
        }
    });
});

//NEW - show form to create new upload
router.get("/upload", middleware.isLoggedIn, function(req, res){
   res.render("uploads/new"); 
});

module.exports = router;

