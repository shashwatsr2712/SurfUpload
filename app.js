var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Upload  = require("./models/upload"),
    User        = require("./models/user")
    
//requiring routes
var uploadRoutes = require("./routes/uploads"),
    indexRoutes      = require("./routes/index")

var url=process.env.DATABASEURL || "mongodb://localhost/yelpc"; 
//var url = "mongodb://localhost/yelpc";
//var url = "mongodb+srv://sunystudious:letmestudy@cluster0-x8jfj.mongodb.net/cluster0?retryWrites=true&w=majority";
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/api/media", uploadRoutes);

let port=process.env.PORT || 3000;
app.listen(port,function(){
    console.log('SurfUpload server has been started!');
});