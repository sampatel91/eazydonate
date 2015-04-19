app.controller("SearchCtrl", function ($scope, $http, $location, $rootScope, $route) {
    //shows results based on user input
    $scope.category = $rootScope.category;
    $scope.search = $rootScope.search;

    $scope.showSearchResults = function (search) {
        $rootScope.search = search;
        $('#srch-term').val('');
        $route.reload();
    };

    var search = $rootScope.search;
    var category = $rootScope.category;

    //if user has entered input in search field
    //then get the results based on that
    if (search) {
        $http.get('/rest/search/' + search)
        .success(function (results) {
            $scope.results = results;
            $rootScope.search = null;
        });
    } else {
        //else get it based on the category user has clicked
        $http.get('/rest/category/' + category)
        .success(function (charities) {
            $scope.results = charities;
            $rootScope.category = null;
        });
    }

    //opens charity page based on id
    $scope.showCharityPage = function (id) {
        $rootScope.charityId = id;
        $location.url('/charity');
    };
});