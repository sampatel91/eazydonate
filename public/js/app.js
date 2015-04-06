var app = angular.module("EazyDonate", [
    'ngRoute'
]);

app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeCtrl'
        }).
        when('/profile', {
            templateUrl: 'pages/profile.html'
        }).
        when('/results', {
            templateUrl: 'pages/result-page.html'
        }).
        when('/charity', {
            templateUrl: 'pages/charity-page.html',
            controller: 'CharityCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
  }]);

app.controller("NavbarCtrl", function ($scope, $http) {
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

    $scope.showSearchResults = function (search) {
        $scope.search = search;
        console.log(search.title)
    };

    $scope.userLogIn = function () {
        $scope.user = { name: "User X" };
        $('#logInModal').modal('hide');
        $('.navbar-right').find('a.loggedOut').addClass('hidden');
        $('.navbar-right').find('a.loggedIn').removeClass('hidden');
    };

    $scope.userSignUp = function () {
        $scope.user = { name: "User X" };
        $('#signUpModal').modal('hide');
        $('.navbar-right').find('a.loggedOut').addClass('hidden');
        $('.navbar-right').find('a.loggedIn').removeClass('hidden');
    };

    $scope.userLogOut = function () {
        $scope.user = { name: "User X" };
        $('#logOutModal').modal('hide');
        $('.navbar-right').find('a.loggedOut').removeClass('hidden');
        $('.navbar-right').find('a.loggedIn').addClass('hidden');
    };

});

app.controller("HomeCtrl", function ($scope, $http) {

    $scope.categories = ["Education", "Shelter", "Food", "Health", "Cancer"];
    $scope.charities = ["Red Cross", "UNICEF", "WHO", "Gates Foundation", "Blue Shield"];

    /*
    $scope.showResultsPage = function ($index, name) {
        var $panel = $('#center-panel');
        $panel.empty();
        $panel.load('result-page.html');
    };*/

    $scope.openCharityPage = function ($index, name) {
        var $panel = $('#center-panel');
        $panel.empty();
        $panel.load('charity-page.html');
    };

});

app.controller("CharityCtrl", function ($scope, $http) {

    $scope.categories = ["Education", "Shelter", "Food", "Health", "Cancer"];
    $scope.results = ["Read Cross", "UNICEF", "WHO", "Gates Foundation", "Blue Shield"];

    $scope.openDonationModal = function ($index, donation) {
        $('#donationModal').modal('show');
        console.log(donation);
    };

    $scope.confirmPaymentInfo = function () {
        $('#donationModal').modal('hide');
    };

    /*
    $scope.showResultsPage = function ($index, name) {
        var $panel = $('#center-panel');
        $panel.empty();
        $panel.load('result-page.html');
    };

    $scope.openCharityPage = function ($index, name) {
        var $panel = $('#center-panel');
        $panel.empty();
        $panel.load('charity-page.html');
    };*/

});