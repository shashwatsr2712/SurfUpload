var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Upload = require("../models/upload");
var middleware = require("../middleware");

// Root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to SurfUpload " + user.username);
           res.redirect("/api/media"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/api/media",
        failureRedirect: "/login"
    }), function(req, res){
});

// Reset password
router.get("/login/reset", function(req, res){
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let otp=Math.floor(1000+Math.random()*9000);
    const msg = {
    to: req.query.email,
    from: 'test@example.com',
    subject: 'OTP For Resetting password',
    text: 'Enter the following OTP on the website to change password:',
    html: `<h1>Enter the following OTP on the website to change password:</h1><br/>
            <h2><strong>${otp}</strong></h2>`,
    };
    sgMail.send(msg).then(() => {
        res.render('reset',{sentotp:otp});
    }, ()=>{
        req.flash("error", 'Some Error occured... Try Again!');
        res.redirect('/');
    }); 
});

// Handle reset password logic
router.post("/login/reset", function(req, res){
    if(req.body.sentotp!=req.body.otp){
        req.flash("error", 'Some Error occured... Try Again!');
        res.redirect('/');
    } else{
        // Assume users with unique email in DB
        User.findOne({"username":req.body.username},function(err,foundUser){
            if(err){
                req.flash("error", 'Some Error occured... Try Again!');
                res.redirect('/'); 
            } else{
                foundUser.setPassword(req.body.newpassword, function(err){
                    if(err){
                        req.flash("error", 'Some Error occured... Try Again!');
                        res.redirect('/'); 
                    } else{
                        foundUser.save(function(err){
                            if(err){
                                req.flash("error", 'Some Error occured... Try Again!');
                                res.redirect('/'); 
                            } else{
                                req.flash("success", 'Password changed successfully!');
                                res.redirect("/");
                            }
                        });
                    }
                });
            }
        });
    }
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});



module.exports = router;