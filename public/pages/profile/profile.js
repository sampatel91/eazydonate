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


    $http.get('/rest/charities/lookup/' + uid)
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

    $scope.deleteCharity = function (id) {
        var currentuser = $rootScope.currentuser;
        var index = currentuser.charities.indexOf(id);
        var charityRemoved = currentuser.charities.splice(index, 1);
        var uid = currentuser._id;
        $http.delete('/rest/user/' + uid + '/charity/' + id, currentuser)
        .success(function (user) {
            $rootScope.currentuser = user;
            $http.get('/rest/charities/lookup/' + user._id)
            .success(function (charities) {
                console.log(charities);
                $scope.charities = charities;
            });
        });
    };

    $scope.deletePerson = function (id) {
        var currentuser = $rootScope.currentuser;
        var index = currentuser.charities.indexOf(id);
        var charityRemoved = currentuser.charities.splice(index, 1);
        var uid = currentuser._id;
        $http.delete('/rest/user/' + uid + '/people/' + id, currentuser)
        .success(function (user) {
            $rootScope.currentuser = user;
            $http.get('/rest/people/lookup/' + user._id)
            .success(function (charities) {
                console.log(charities);
                $scope.people = charities;
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
        $http.put('/rest/user/' + uid + '/people/' + id, user)
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
        $http.delete('/rest/user/' + uid + '/people/' + id, currentuser)
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
