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

    $scope.openProfile = function (id) {
        $rootScope.userId = null;
        $route.reload();
    };

    // opens modal with form to add a course
    $scope.openLogInModal = function () {
        $scope.user = {firstName: '', lastName: '', gender: '', email: ''};
        if ($scope.logIn_form) {
            $scope.logIn_form.$setPristine();
            $scope.logIn_form.$setUntouched();
        }
        $('#logInModal').modal('show');
    };

    $scope.openSignUpModal = function () {
        $scope.user = { firstName: '', lastName: '', gender: '', email: '', password: '', pass2: ''};
        if ($scope.form) {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        }
        $('#signUpModal').modal('show');
    };

    $scope.openLogOutModal = function () {
        if ($scope.form) {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
        }
        $('#logOutModal').modal('show');
    };

    $scope.showSearchResults = function (search) {
        $rootScope.search = search;
        $('#srch-term').val('');
        console.log(search.title);
        $route.reload();
    };

    $scope.userLogIn = function (user) {
        console.log("log in");
        /*
        if ($scope.form.$invalid) {
            return;
        }*/

        $http.post('/login', user)
        .success(function (response) {
            console.log(response);
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

    $scope.userSignUp = function (user) {

        if ($scope.form.$invalid) {
            return;
        }
        /*console.log(user.dob);
        if (!user.dob) {
            var date = new Date();
            user.dob = date;
        }*/
        //user.dob = $scope.formatDate(user.dob);
        //console.log(user.dob);
        if (user.password == user.pass2) {
            $http.post('/register', user)
           .success(function (response) {
               $rootScope.currentuser = response;
               console.log("Response:");
               console.log(response);
               console.log(user);
               $location.path("/profile");
           });
            $('#signUpModal').modal('hide');
            $location.url('/profile');
        }
    };


    $scope.userLogOut = function () {
        $http.post('/logout')
        .success(function () {
            $location.url('/logout');
            $rootScope.currentuser = null;
        });

        $('#logOutModal').modal('hide');
        $location.url('/');
    };

    /*
    Utility Methods
    */
    // formats dateCreated value to be more human-readable
    $scope.formatDate = function (date) {
        console.log("in formatDate");
        var date = new Date(date)
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








