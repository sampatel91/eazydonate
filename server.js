var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.use(express.static(__dirname + '/public'));

// Master course list
var courses = [
	{ name: "java 123", category: "PROG", dateCreated: "Tue Mar 24 2015 10:49:58 GMT-0400 (EDT)", description: "Awesome" },
	{ name: "Java 234", category: "PROG", dateCreated: "Tue Mar 24 2015 10:49:58 GMT-0400 (EDT)", description: "Awesome" }
];

// GET
// /api/courses
// Retrieves all courses
app.get('/api/courses', function (req, res) {
    res.json(courses);
});

// GET
// /api/courses/:index
// Retrieves course at given index
app.get('/api/courses/:index', function (req, res) {
    var index = req.params.index;
    res.json(courses[index]);
});

// POST
// /api/courses
// Adds given course to course list
app.post('/api/courses', function (req, res) {
    var newCourse = req.body;
    console.log(newCourse);
    courses.push(newCourse);
    res.json(courses);
});

// PUT
// /api/course/:index
// Updates course with given changed course at given index
app.put('/api/course/:index', function (req, res) {
    var index = req.params.index;
    var updatedCourse = req.body;
    courses[index] = updatedCourse;
    res.json(courses);
});

// DELETE
// /api/course/:index
// Deletes course at given index
app.delete('/api/course/:index', function (req, res) {
    var index = req.params.index;
    courses.splice(index, 1);
    res.json(courses);
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);