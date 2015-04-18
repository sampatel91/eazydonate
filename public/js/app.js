var app = angular.module("EazyDonate", [
    'ngRoute'
]);

app.config(['$routeProvider',
  function ($routeProvider, $httpProvider) {
      $routeProvider.
        when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeCtrl'
        }).
        when('/profile', {
            templateUrl: 'pages/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        }).
        when('/results', {
            templateUrl: 'pages/result-page.html',
            controller: 'ResultCtrl'
        }).
        when('/charity', {
            templateUrl: 'pages/charity-page.html',
            controller: 'CharityCtrl'
        }).
        when('/logout', {
            templateUrl: 'pages/logout.html',
            controller: 'LogoutCtrl'
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

app.factory("DonateService", function ($http) {
    var findCharityByTitle = function (title, callback) {
        var url = "";
        $http.jsonp(url)
        .success(callback);
    };

});

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

app.controller("ProfileCtrl", function ($scope, $http, $rootScope, $location, $route) {
    var currentuser = $rootScope.currentuser;
    var uid = currentuser._id;

    var id = $rootScope.userId;
    if (id && uid !== id) {
        $http.get('/rest/user/' + id)
        .success(function (user) {
            if (user) {
                $scope.user = user;
                uid = user._id;
                $scope.isFollowed($scope.user);
            }
            else {
                $scope.user = currentuser;
                $scope.isFollowed($scope.user);
            }
        });
    }

    if (!id || uid == id) {
        $scope.user = currentuser;
    }
    
    $scope.isFollowed = function (user) {
        if (user && currentuser.people && user._id !== currentuser._id) {
            var people = currentuser.people;
            var id = user._id;
            $scope.isFollowed = false;
            for (index = people.length - 1; index >= 0; --index) {
                if (people[index] == id) {
                    $scope.isFollowed = true;
                }
            }
        }
    }
    

    $http.get('/rest/charities/lookup/'+ uid)
    .success(function (charities) {
        console.log(charities);
        $scope.charities = charities;
    });

    $http.get('/rest/people/lookup/' + uid)
    .success(function (people) {
        console.log(people);
        $scope.people = people;
    });


    $scope.deleteAccount = function (id) {
        $http.delete('/rest/user/' + id)
        .success(function (users) {
            $rootScope.currentuser = null;
            $location.url('/home');
        });
    };

    $scope.deleteFavorite = function (id) {
        var currentuser = $rootScope.currentuser;
        var index = currentuser.charities.indexOf(id);
        var charityRemoved = currentuser.charities.splice(index, 1);
        var uid = currentuser._id;
        $http.put('/rest/user/' + uid, currentuser)
        .success(function (user) {
            $rootScope.currentuser = user;
            $http.get('/rest/charities/lookup/' + user._id)
            .success(function (charities) {
                console.log(charities);
                $scope.charities = charities;
            });
        });
    };

    $scope.openCharityPage = function (charity) {
        $rootScope.charityId = charity._id;
        $location.url('/charity');
    };

    $scope.followUser = function (id) {
        var currentuser = $rootScope.currentuser;
        currentuser.people.push(id);
        var uid = currentuser._id;
        var user = currentuser;
        $http.put('/rest/user/' + uid, user)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = true;
        });
    };

    $scope.unfollowUser = function (id) {
        var currentuser = $rootScope.currentuser;
        var index = currentuser.people.indexOf(id);
        var personRemoved = currentuser.people.splice(index, 1);
        var uid = currentuser._id;
        var user = currentuser;
        $http.put('/rest/user/' + uid, currentuser)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = false;
        });
    };

    $scope.openProfile = function (id) {
        $rootScope.userId = id;
        $route.reload();
    };
})



app.controller("LogoutCtrl", function ($scope, $http, $rootScope) {

    /*
    $http.get("/rest/user")
    .success(function (users) {
        $scope.users = users;
    });

    $scope.removeUser = function (id) {
        console.log("remove");
        $http.delete("/rest/user/"+ id)
        .success(function (users) {
            $scope.users = users;
        });
    }*/
    
})

app.controller("HomeCtrl", function ($scope, $http, $rootScope, $location) {
    $rootScope.userId = null;
    if ($rootScope.currentuser && $rootScope.currentuser.charities) {
        var currentuser = $rootScope.currentuser;
        var uid = currentuser._id;
        $http.get('/rest/charities/lookup/' + uid)
        .success(function (charities) {
            console.log(charities);
            $scope.favcharities = charities;
        });
    }

    $http.get("/rest/charities?limit=1&full=true")
    .success(function (response) {
        $scope.charities = response;
    });

    
    

    $http.get("/rest/categories")
    .success(function (response) {
        $scope.categories = response;
    });

    $scope.openCharityPage = function (charity) {
        $rootScope.charityId = charity._id;
        $location.url('/charity');
    };

    $scope.findCharities = function (category) {
        $rootScope.category = category;
    };

});

app.controller("CharityCtrl", function ($rootScope, $scope, $http) {
    
    var currentuser = $rootScope.currentuser;
    if (currentuser && currentuser.charities) {
        var charities = currentuser.charities;
        var id = $rootScope.charityId;
        $scope.isFollowed = false;
        for (index = charities.length - 1; index >= 0; --index) {
            if(charities[index] == id){
                $scope.isFollowed = true;
            }
        }
        /*
        charities.forEach(function (charity) {
            if (charity == id) {
                $scope.isFollowed = true;
            }
        });*/
        
    }

    var charityId = $rootScope.charityId;
    $http.get('/rest/charities/' + charityId)
    .success(function (charity) {
        console.log(charity);
        $scope.charity = charity;
    });

    $http.get('/rest/user/lookup/' + charityId)
    .success(function (members) {
        console.log(members);
        $scope.members = members;
    });

    $scope.followCharity = function (id) {
        var currentuser = $rootScope.currentuser;
        currentuser.charities.push(id);
        var uid = currentuser._id;
        var user = currentuser;
        $http.put('/rest/user/' + uid, user)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = true;
        });
        var charity = $scope.charity;
        charity.members.push(uid);
        $http.put('/rest/charity/' + charityId, charity)
        .success(function (charity) {
            $scope.charity = charity;
        });
    };

    $scope.unfollowCharity = function (id) {
        var currentuser = $rootScope.currentuser;
        var index = currentuser.charities.indexOf(id);
        var charityRemoved = currentuser.charities.splice(index, 1);
        var uid = currentuser._id;
        var user = currentuser;
        $http.put('/rest/user/' + uid, currentuser)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = false;
        });
    };

    $scope.openDonationModal = function ($index, donation) {
        $('#donationModal').modal('show');
        console.log(donation);
    };

    $scope.confirmPaymentInfo = function () {
        $('#donationModal').modal('hide');
    };

    $scope.openProfile = function (id) {
        $rootScope.userId = id;
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


app.controller("ResultCtrl", function ($scope, $http, $rootScope, $location) {
    var category = $rootScope.category;
    var search = $rootScope.search;
    console.log(category);

    if (search) {
        $http.get('/rest/search/' + search)
        .success(function (results) {
            $scope.results = results;
        });
    } else {
        $http.get('/rest/category/' + category)
        .success(function (charities) {
            console.log(charities);
            $scope.results = charities;
        });
    }

    $scope.showCharityPage = function (id) {
        $rootScope.charityId = id;
        $location.url('/charity');
    };

});