app.controller("HomeCtrl", function ($scope, $http, $rootScope, $location) {
    $rootScope.userId = null;

    //check if currentuser is logged in and hav fav charities
    if ($rootScope.currentuser && $rootScope.currentuser.charities) {
        var currentuser = $rootScope.currentuser;
        var uid = currentuser._id;
        $http.get('/rest/charities/lookup/' + uid)
        .success(function (charities) {
            $scope.favcharities = charities;
        });
    }

    //get all the charities
    $http.get("/rest/charities?limit=1&full=true")
    .success(function (response) {
        $scope.charities = response;
    });

    //get all the categories
    $http.get("/rest/categories")
    .success(function (response) {
        $scope.categories = response;
    });

    //takes user to the charity page
    $scope.openCharityPage = function (charity) {
        $rootScope.charityId = charity._id;
        $location.url('/charity');
    };

    //takes user to result page based on category
    $scope.findCharities = function (category) {
        $rootScope.category = category;
    };

});
