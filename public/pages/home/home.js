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
