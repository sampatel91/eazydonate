﻿var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var connectionString = 'mongodb://openshift_1543hle1_44gdsl8c:561991@ds061731.mongolab.com:61731/openshift_1543hle1_44gdsl8c';
//var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test';
var ObjectId = mongojs.ObjectId;
var db = mongojs(connectionString, ["users", "charities"]);
mongoose.connect(connectionString);
//var db = mongoose.connect(connectionString);
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

//Schema for Users
var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    email: String,
    password: String,
    charities: [String],
    people: [String]
});

//Schema for Charity
var CharitySchema = new mongoose.Schema({
    name: String,
    description: String,
    dateCreated: String,
    email: String,
    posts: [{
        title: String,
        details: String
    }],
    categories: [String],
    members: [String]
}, {collection: 'charities'});


var UserModel = mongoose.model('User', UserSchema);
var CharityModel = mongoose.model('Charities', CharitySchema);

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

passport.use(new LocalStrategy(
function (email, password, done) {

    UserModel.findOne({ email: email, password: password }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);

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


var categories = ["Humanity", "Education", "Food", "Health", "Animals", "Social", "Religion"];
//var categories = ["Education", "Shelter", "Food", "Health", "Cancer"];
//var charities = ["Red Cross", "UNICEF", "WHO", "Gates Foundation", "Blue Shield"];


//return all the charities
app.get('/rest/charities', function (req, res) {
    CharityModel.find(function (err, charities) {
        res.json(charities);
    });
    
});

//return charities followed by a user of provided ID
app.get('/rest/charities/lookup/:id', function (req, res) {
    var id = req.params.id;
    UserModel.findOne({ _id: id }, function (err, user) {
        var charities = user.charities;
        var ids = charities.map(function (id) { return id });
        CharityModel.find({ _id: { $in: ids } }, function (err, charities) {
            res.json(charities);
        });
    });
});

//return charity with given ID 
app.get('/rest/charities/:id', function (req, res) {
    var id = req.params.id;
    CharityModel.findOne({_id: id},function (err, charity) {
        res.json(charity);
    });

});

//return all of the categories
app.get('/rest/categories', function (req, res) {
    res.json(categories);
});

//find all the categories of a charity with given ID
app.get('/rest/category/:id', function (req, res) {
    var id = req.params.id;
    CharityModel.find({ categories: id }, function (err, charities) {
        res.json(charities);
    });
    
});

//return result for the search term
app.get('/rest/search/:name', function (req, res) {
    var name = req.params.name;
    CharityModel.find({ $text: { $search: name }},
    /*
    CharityModel.find({
        $or: [{ name: { $regex: name, $options: 'i' } },
            { description: { $regex: name, $options: 'i' } },
        { categories: { $regex: name, $options: 'i' } }]
    },*/
    function (err, charities) {
        console.log(charities);
        res.json(charities);
    });
    
});

//return all of the users
app.get("/rest/user", function (req, res) {
    UserModel.find(function (err, users) {
        res.json(users);
    });
});

//return user with the given ID
app.get('/rest/user/:id', function (req, res) {
    var id = req.params.id;
    UserModel.findOne({ _id: id }, function (err, user) {
        res.json(user);
    });

});

//returns all of the members of a charity with the give ID
app.get('/rest/user/lookup/:id', function (req, res) {
    var id = req.params.id;
    CharityModel.findOne({ _id: id }, function (err, charity) {
        UserModel.find({ _id: { $in: charity.members } }, function (err, users) {
            res.json(users);
        });
    });
});

//returns all of the user followed by the user with given ID
app.get('/rest/people/lookup/:id', function (req, res) {
    var id = req.params.id;
    UserModel.findOne({ _id: id }, function (err, user) {
        var people = user.people;
        var ids = people.map(function (id) { return id });
        UserModel.find({ _id: { $in: ids } }, function (err, users) {
            res.json(users);
        });
    });
});

//delets the user with given ID
app.delete("/rest/user/:id", function (req, res) {
    var id = req.params.id;
    UserModel.remove({_id: id}, function (err, count) {
        UserModel.find(function (err, users) {
            res.json(users);
        });
    });
});

//adds a new member with ID to a charity with given charity ID
app.put("/rest/charity/:id/member/:userId", function (req, res) {
    db.runCommand(
    {
        findAndModify: "charities",
        query: { _id: ObjectId(req.params.id) },
        update: { $addToSet: { members: req.params.userId } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//Remove a user with given userID from a charity with given ID
app.delete('/rest/charity/:id/member/:userID', function (req, res) {
    db.runCommand(
    {
        findAndModify: "charities",
        query: { _id: ObjectId(req.params.id) },
        update: { $pull: { members: req.params.userID } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//adds a user to people followed by user with given id
app.put("/rest/user/:id/people/:userId", function (req, res) {
    db.runCommand(
    {
        findAndModify: "users",
        query: { _id: ObjectId(req.params.id) },
        update: { $addToSet: { people: req.params.userId } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//Removes a user to people followed by user with given id
app.delete('/rest/user/:id/people/:userID', function (req, res) {
    db.runCommand(
    {
        findAndModify: "users",
        query: { _id: ObjectId(req.params.id) },
        update: { $pull: { people: req.params.userID } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//adds a charity with given ID to a list of charities followed by given user ID
app.put("/rest/user/:id/charity/:charityId", function (req, res) {
    db.runCommand(
    {
        findAndModify: "users",
        query: { _id: ObjectId(req.params.id) },
        update: { $addToSet: { charities: req.params.charityId } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//Removes a charity with given ID to a list of charities followed by given user ID
app.delete('/rest/user/:id/charity/:charityID', function (req, res) {
    db.runCommand(
    {
        findAndModify: "users",
        query: { _id: ObjectId(req.params.id) },
        update: { $pull: { charities: req.params.charityID } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//updates a charity with a given charity
app.put("/rest/charity/:id", function (req, res) {
    var id = req.params.id;
    CharityModel.findById(id, function (err, charity) {
        charity.update(req.body, function (err, count) {
            CharityModel.findById(id, function (err, charity) {
                res.json(charity);
            });
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
MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: Y2JxXVCM6Djv
   Database Name: eazydonate

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/



Please make note of these MongoDB credentials:
  RockMongo User: admin
  RockMongo Password: Y2JxXVCM6Djv
URL: https://eazydonate-spatel91.rhcloud.com/rockmongo/

*/

/*

*/

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ip);