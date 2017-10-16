var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    Campground = require('./models/campground'),
    User = require('./models/user'),
    Comment = require('./models/comment');
    // seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

// mongoose.connect('mongodb://localhost/yelp_camp');

//type in command line  export DATABASEURL=mongodb://localhost/yelp_camp

var url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(url);

//this one put it on heroku
// mongoose.connect('mongodb://JFRC:118johanna@ds113835.mlab.com:13835/yelpcampdatabase');


app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'anithing that I want',
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// app.listen(8080, function(){
//     console.log('Listenting on 8080');
// });

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
