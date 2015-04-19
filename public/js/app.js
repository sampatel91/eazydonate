var app = angular.module("EazyDonate", [
    'ngRoute'
]);

app.config(['$routeProvider',
  function ($routeProvider, $httpProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: 'pages/home/home.html',
            controller: 'HomeCtrl'
        }).
        when('/profile', {
            templateUrl: 'pages/profile/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        }).
        when('/results', {
            templateUrl: 'pages/results/result-page.html',
            controller: 'ResultCtrl'
        }).
        when('/charity', {
            templateUrl: 'pages/charity/charity-page.html',
            controller: 'CharityCtrl'
        }).
        when('/logout', {
            templateUrl: 'pages/logout/logout.html'
        }).
        when('/donation', {
            templateUrl: 'pages/donation/donation.html'
        }).
        when('/search', {
            templateUrl: 'pages/search/search.html',
            controller: 'SearchCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });

  }]);

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0')
            deferred.resolve();
            // User is Not Authenticated
        else {
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/');
        }
    });

    return deferred.promise;
};

app.controller("NavbarCtrl", function ($scope, $http, $location, $rootScope, $route) {

    $('.nav a').on('click', function () {
        $(".navbar-toggle").click();
    });

    $scope.openProfile = function (id) {
        $rootScope.userId = null;
        $route.reload();
    };

    // opens modal with form to log in
    $scope.openLogInModal = function () {
        $scope.user = {firstName: '', lastName: '', gender: '', email: ''};
        if ($scope.logIn_form) {
            $scope.logIn_form.$setPristine();
            $scope.logIn_form.$setUntouched();
        }
        $('#logInModal').modal('show');
    };

    // opens modal with form to add a user
    $scope.openSignUpModal = function () {
        $scope.user = { firstName: '', lastName: '', gender: '', email: '', password: '', pass2: ''};
        if ($scope.form) {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        }
        $('#signUpModal').modal('show');
    };

    // opens modal to confirm log out
    $scope.openLogOutModal = function () {
        if ($scope.form) {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        }
        $('#logOutModal').modal('show');
    };

    //lets user log in if account already exists
    //sends user to profile page
    $scope.userLogIn = function (user) {
        $http.post('/login', user)
        .success(function (response) {
            var user = response;
            $rootScope.currentuser = user;
            $('#logInModal').modal('hide');
            $scope.invalidLogIn = false;
            $location.path("/profile");
        });

        if (!$rootScope.currentuser) {
            $scope.invalidLogIn = true;
        };
        
    };

    //creates a user account
    //send user to profile page
    $scope.userSignUp = function (user) {

        if ($scope.form.$invalid) {
            return;
        }
        if (user.password == user.pass2) {
            $http.post('/register', user)
           .success(function (response) {
               $rootScope.currentuser = response;
               $location.path("/profile");
           });
            $('#signUpModal').modal('hide');
            $location.url('/profile');
        }
    };

    //log out the currentuser
    $scope.userLogOut = function () {
        $http.post('/logout')
        .success(function () {
            $location.url('/logout');
            $rootScope.currentuser = null;
        });

        $('#logOutModal').modal('hide');
        $location.url('/');
    };
});








