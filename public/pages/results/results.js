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