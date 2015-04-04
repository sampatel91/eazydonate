//angular app instance
var app = angular.module("EazyDonate", []);

//controller for the app
app.controller("EazyDonateController", function ($scope, $http) {

    $('#north-panel').load('header.html');
    $('#center-panel').load('charity-posts.html');

    $scope.categories = ["Education", "Shelter", "Food", "Health", "Cancer"];
    $scope.charities = ["Read Cross", "UNICEF", "WHO", "Gates Foundation", "Blue Shield"];
    

    // opens modal with form to add a course
    $scope.openLogInModal = function () {
        $('#logInModal').modal('show');
    };

    $scope.openSignUpModal = function () {
        $('#signUpModal').modal('show');
    };

    $scope.openLogOutModal = function () {
        $('#logOutModal').modal('show');
    };

    $scope.userLogIn = function () {
        $scope.user = { name: "User X" };
        $('#logInModal').modal('hide');
        $('.navbar-right').find('button.loggedOut').addClass('hidden');
        $('.navbar-right').find('button.loggedIn').removeClass('hidden');
    };

    $scope.userSignUp = function () {
        $scope.user = { name: "User X" };
        $('#signUpModal').modal('hide');
        $('.navbar-right').find('button.loggedOut').addClass('hidden');
        $('.navbar-right').find('button.loggedIn').removeClass('hidden');
    };

    $scope.showResultsPage = function ($index, name) {
        var $panel = $('#center-panel');
        $panel.empty();
        $panel.load('result-page.html');
    };

    $scope.openCharityPage = function ($index, name) {
        var $panel = $('#center-panel');
        $panel.empty();
        $panel.load('charity-page.html');
    };

});