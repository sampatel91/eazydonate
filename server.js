var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/test';
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

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    email: String,
    password: String,
    charities: [String],
    people: [String]
});


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

var admin = new UserModel({firstName: "Saumil", lastName: "Patel", gender: "Male", password: "561991", email: "spatel91@yahoo.com"});
admin.save();
var char1 = new CharityModel({
    name: "Red Cross",
    description: "The World Health Organization WHO is a specialized agency of the United Nations (UN) that is concerned with international public health. It was established on 7 April 1948, headquartered in Geneva, Switzerland. The WHO is a member of the United Nations Development Group. Its predecessor, the Health Organization, was an agency of the League of Nations. The constitution of the World Health Organization had been signed by 61 countries on 22 July 1946, with the first meeting of the World Health Assembly finishing on 24 July 1948.",
    posts: [{
        title: "Post 1",
        details: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }, {
        title: "Post 2",
        details: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }, {
        title: "Post 3",
        details: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }, {
        title: "Post 4",
        details: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }],
    categories: ['Education', 'Food']
});
var char2 = new CharityModel({
    name: "UNICEF",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});
var char3 = new CharityModel({
    name: "WHO",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});
var char4 = new CharityModel({
    name: "BMC",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});
var char5 = new CharityModel({
    name: "Gates Foundation",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});
var char6 = new CharityModel({
    name: "Kill Hunger",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});
var char7 = new CharityModel({
    name: "Red Cross",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
});
char1.save();
char2.save();
char3.save();
char4.save();
char5.save();
char6.save();
char7.save();



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



var categories = ["Education", "Shelter", "Food", "Health", "Cancer"];
//var charities = ["Red Cross", "UNICEF", "WHO", "Gates Foundation", "Blue Shield"];



// GET
// /api/courses
// Retrieves all courses
app.get('/rest/charities', function (req, res) {
    CharityModel.find(function (err, charities) {
        res.json(charities);
    });
    
});

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

app.get('/rest/charities/:id', function (req, res) {
    var id = req.params.id;
    CharityModel.findOne({_id: id},function (err, charity) {
        res.json(charity);
    });

});

app.get('/rest/categories', function (req, res) {
    res.json(categories);
});

app.get('/rest/category/:id', function (req, res) {
    var id = req.params.id;
    CharityModel.find({ categories: id }, function (err, charities) {
        res.json(charities);
    });
    
});

app.get('/rest/search/:name', function (req, res) {
    var name = req.params.name;
    CharityModel.find({ name: { $regex: name } },
        function (err, charities) {
            console.log(charities);
            res.json(charities);
    })
    
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

app.get('/rest/user/:id', function (req, res) {
    var id = req.params.id;
    UserModel.findOne({ _id: id }, function (err, user) {
        res.json(user);
    });

});

app.get('/rest/user/lookup/:id', function (req, res) {
    var id = req.params.id;
    CharityModel.findOne({ _id: id }, function (err, charity) {
        var members = charity.members;
        var ids = members.map(function (id) { return ObjectId(id) });
        UserModel.find({ _id: { $in: ids } }, function (err, users) {
            res.json(users);
        });
    });
});

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

app.delete("/rest/user/:id", function (req, res) {
    var id = req.params.id;
    UserModel.remove({_id: id}, function (err, count) {
        UserModel.find(function (err, users) {
            res.json(users);
        });
    });
});

app.put("/rest/charity/:id/member/:userId", function (req, res) {
    db.runCommand(
    {
        findAndModify: "charities",
        query: { _id: ObjectId(req.params.id) },
        update: { $addToSet: { member: req.params.userId } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

//Remove from favorites
app.delete('/rest/user/:id/member/:userID', function (req, res) {
    db.runCommand(
    {
        findAndModify: "charities",
        query: { _id: ObjectId(req.params.id) },
        update: { $pull: { member: req.params.userID } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
});

app.put("/rest/user/:id/people/:userId", function (req, res) {
    //var charity = req.params.body.charities;
    console.log(req.params.body);
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

//Remove from favorites
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


app.put("/rest/user/:id/charity/:charityId", function (req, res) {
    //var charity = req.params.body.charities;
    console.log(req.params.body);
    db.runCommand(
    {
        findAndModify: "users",
        query: { _id: ObjectId(req.params.id) },
        update: { $addToSet: { charities: req.params.charityId } },
        new: true
    }, function (err, response) {
        res.json(response.value);
    });
    /*
    var id = req.params.id;
    UserModel.findById(id, function (err, user) {
        user.update(req.body, function (err, count) {
            UserModel.findById(id, function (err, user) {
                res.json(user);
            });
        });
    });*/
});

//Remove from favorites
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