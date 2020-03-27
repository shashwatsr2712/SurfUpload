var Upload = require("../models/upload");

// all the middleare goes here
var middlewareObj = {};

// middlewareObj.checkUploadOwnership = function(req, res, next) {
//  if(req.isAuthenticated()){
//         Upload.findById(req.params.id, function(err, foundUpload){
//            if(err){
//                req.flash("error", "Upload not found");
//                res.redirect("back");
//            }  else {
//                // does user own the upload?
//             if(foundUpload.author.id.equals(req.user._id)) {
//                 next();
//             } else {
//                 req.flash("error", "You don't have permission to do that");
//                 res.redirect("back");
//             }
//            }
//         });
//     } else {
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
// }

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;
