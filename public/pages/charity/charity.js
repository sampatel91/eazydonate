app.controller("CharityCtrl", function ($rootScope, $scope, $http) {

    var currentuser = $rootScope.currentuser;
    if (currentuser && currentuser.charities) {
        var charities = currentuser.charities;
        var id = $rootScope.charityId;
        $scope.isFollowed = false;
        for (index = charities.length - 1; index >= 0; --index) {
            if (charities[index] == id) {
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
        //$scope.members = charity.members;
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
        $http.put('/rest/user/' + uid + '/charity/' + id, user)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = true;
        });
        var charity = $scope.charity;
        charity.members.push(uid);
        $http.put('/rest/charity/' + charityId + '/member/' + uid, charity)
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
        $http.delete('/rest/user/' + uid + '/charity/' + id, currentuser)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = false;
        });
        $http.delete('/rest/charity/' + charityId + '/member/' + uid, charity)
        .success(function (charity) {
            $scope.charity = charity;
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
