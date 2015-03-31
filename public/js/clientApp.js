//angular app instance
var app = angular.module("OnlineUniversity", []);

//controller for the app
app.controller("OnlineUniversityController", function ($scope, $http) {

    // Initial rendering of courses
    $http.get("/api/courses")
    .success(function (response) {
        $scope.courses = response;
    });

    // opens modal with form to add a course
    $scope.openAddModal = function () {
        $scope.submitCourse = $scope.addCourse;
        if ($scope.form) {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        }
        var today = new Date();
        $scope.newCourse = { name: "", category: "", dateCreated: today, description: "" };
        $('#courseModal').modal('show');
    };

    // opens modal with populated fields in the form
    // from previous data
    $scope.openEditModal = function (course, index) {
        $scope.submitCourse = $scope.editCourse;
        $scope.editIndex = index;
        course.dateCreated = new Date(course.dateCreated);
        $scope.newCourse = course;
        $('#courseModal').modal('show');
    };

    // updates course with new data at $scope.editIndex
    $scope.editCourse = function (updatedCourse) {
        $('#courseModal').modal('hide');
        $http.put('/api/course/' + $scope.editIndex, updatedCourse).
		success(function (response) {
		    $scope.courses = response;
		});
    };

    // adds course to database
    $scope.addCourse = function (newCourse) {
        $('#courseModal').modal('hide');
        $http.post('/api/courses', newCourse).
		success(function (response) {
		    $scope.courses = response;
		});
    };

    // removes course at index from database
    $scope.removeCourse = function (course, index) {
        $http.delete('/api/course/' + index).
		success(function (response) {
		    $scope.courses = response;
		});
    };

    // formats dateCreated value to be more human-readable
    $scope.formatDate = function (date) {
        date = new Date(date);
        var month = dateFormat(date.getMonth() + 1);
        var day = dateFormat(date.getDate());
        return month + '/' + day + '/' + date.getFullYear();
    };

    // Pads single digit number with leading zeroes
    function dateFormat(n) {
        if (n >= 10)
            return n;
        else
            return "0" + n;
    }

});