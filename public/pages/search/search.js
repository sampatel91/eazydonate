app.controller("SearchCtrl", function ($scope, $http, $location, $rootScope, $route) {
    var updateSearch = function (search, category) {
        //if user has entered input in search field
        //then get the results based on that
        if ($rootScope.search) {
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
    };


    //shows results based on user input
    $scope.category = $rootScope.category;
    $scope.search = $rootScope.search;
    updateSearch($scope.search, $scope.category);

    $scope.showSearchResults = function (search) {
        $rootScope.search = search;
        var category = $scope.category;
        updateSearch(search, category);
        $scope.searchTitle = search;
        //$scope.$digest();
        //$('#srch-term').val('');
        //$route.reload();
    };

    

    //opens charity page based on id
    $scope.showCharityPage = function (id) {
        $rootScope.charityId = id;
        $location.url('/charity');
    };
});