app.controller("ResultCtrl", function ($scope, $http, $rootScope, $location) {
    var category = $rootScope.category;
    var search = $rootScope.search;

    //if user has entered input in search field
    //then get the results based on that
    if (search) {
        $http.get('/rest/search/' + search)
        .success(function (results) {
            $scope.results = results;
        });
    } else {
        //else get it based on the category user has clicked
        $http.get('/rest/category/' + category)
        .success(function (charities) {
            $scope.results = charities;
        });
    }

    //opens charity page based on id
    $scope.showCharityPage = function (id) {
        $rootScope.charityId = id;
        $location.url('/charity');
    };

});