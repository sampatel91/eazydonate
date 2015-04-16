var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test';
var db = mongoose.connect(connectionString);
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    //dob: Date,
    email: String,
    password: String
});

var UserModel = mongoose.model('UserModel', UserSchema);
//var user1 = new UserModel({ name: "spatel", password: "123", email: "Saumil" });
//user1.save();


var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

/*


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String
}, { collection: 'usersData' });

var CharitySchema = new mongoose.Schema({
    name: String,
    description: String,
    dateCreated: String,
    email: String,
    posts: [{
        title: String,
        description: String
    }]
}, { collection: 'CharityData' });


var CharityModel = mongoose.model('CharityModel', CharitySchema);



*/

/*var mongoose = require('mongoose');

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test';

mongoose.connect(connectionString);
//mongoose.connect('mongodb://localhost/test');

var WebSiteSchema = new mongoose.Schema({
    name: String,
    Date: {type: Date, default: Date.now}
}, {collection: 'website'});

var WebSiteModel = mongoose.model('WebSite', WebSiteSchema);
*/

passport.use(new LocalStrategy(
function (email, password, done) {

    UserModel.findOne({ email: email, password: password }, function (err, user) {
        /*if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);*/

        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: 'Unable to login' });
        
    })
    
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



var categories = ["Education", "Shelter", "Food", "Health", "Cancer"];
//var charities = ["Red Cross", "UNICEF", "WHO", "Gates Foundation", "Blue Shield"];

var charities = [
    { name: "Red Cross", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
    { name: "UNICEF", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
    { name: "WHO", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
    { name: "BMC", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
    { name: "Gates Foundation", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
    { name: "Kill Hunger", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
    { name: "Red Cross", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
];

// GET
// /api/courses
// Retrieves all courses
app.get('/api/charities', function (req, res) {
    res.json(charities);
});

app.get('/api/categories', function (req, res) {
    res.json(categories);
});

app.post("/login", passport.authenticate('local'), function (req, res) {
    //console.log(req.user);
    //res.json(req.user);

    var user = req.user;
    var date = user.dob;
    //user.dob = formatDate(date);
    console.log(user);
    res.json(user);
    //console.log(user.dob);
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});

app.post('/register', function (req, res) {
    var newUser = req.body;
    console.log(newUser);
    UserModel.findOne({ username: newUser.email }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            console.log(user);
            res.json(null);
            return;
        }
        var newUser = new UserModel(req.body);
        newUser.save(function (err, user) {
            req.login(user, function (err) {
                if (err) { return next(err); }
                //console.log("dob before: " + user.dob);
                //user.dob = formatDate(user.dob);
                //console.log("dob after: " + user.dob);
                res.json(user);
            });
        });
    });
});


app.get("/rest/user", function (req, res) {
    UserModel.find(function (err, users) {
        res.json(users);
    });
});

app.delete("/rest/user/:id", function (req, res) {
    var id = req.params.id;
    UserModel.remove({_id: id}, function (err, count) {
        UserModel.find(function (err, users) {
            res.json(users);
        });
    });
});

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};
/*
app.put("/rest/user/:id", auth, function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {
        user.update(req.body, function (err, count) {
            UserModel.find(function (err, users) {
                res.json(users);
            });
        });
    });
});

app.post("/rest/user", auth, function (req, res) {
    UserModel.findOne({ username: req.body.username }, function (err, user) {
        if (user == null) {
            user = new UserModel(req.body);
            user.save(function (err, user) {
                UserModel.find(function (err, users) {
                    res.json(users);
                });
            });
        }
        else {
            UserModel.find(function (err, users) {
                res.json(users);
            });
        }
    });
});*/

/*

MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: Y2JxXVCM6Djv
   Database Name: eazydonate

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/

*/

/*

*/

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ip);