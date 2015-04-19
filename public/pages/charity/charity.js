app.controller("CharityCtrl", function ($rootScope, $scope, $http) {

    var currentuser = $rootScope.currentuser;

    //check if user is following this charity
    if (currentuser && currentuser.charities) {
        var charities = currentuser.charities;
        var id = $rootScope.charityId;
        $scope.isFollowed = false;
        for (index = charities.length - 1; index >= 0; --index) {
            if (charities[index] == id) {
                $scope.isFollowed = true;
            }
        }
    }

    //get current charity data
    var charityId = $rootScope.charityId;
    $http.get('/rest/charities/' + charityId)
    .success(function (charity) {
        $scope.charity = charity;
    });

    //get all the charity members
    $http.get('/rest/user/lookup/' + charityId)
    .success(function (members) {
        $scope.members = members;
    });

    //lets current user follow this charity
    $scope.followCharity = function (id) {
        var currentuser = $rootScope.currentuser;
        currentuser.charities.push(id);
        var uid = currentuser._id;
        //var user = currentuser;
        $http.put('/rest/user/' + uid + '/charity/' + id)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = true;
        });
        //var charity = $scope.charity;
        //charity.members.push(uid);
        $http.put('/rest/charity/' + charityId + '/member/' + uid)
        .success(function (charity) {
            $scope.charity = charity;
        });
    };

    //lets user unfollow this charity
    $scope.unfollowCharity = function (id) {
        var currentuser = $rootScope.currentuser;
        var index = currentuser.charities.indexOf(id);
        var charityRemoved = currentuser.charities.splice(index, 1);
        var uid = currentuser._id;
        //var user = currentuser;
        //removes charity from users' database
        $http.delete('/rest/user/' + uid + '/charity/' + id)
        .success(function (user) {
            $rootScope.currentuser = user;
            $scope.isFollowed = false;
        });
        //removes user from charity's database
        $http.delete('/rest/charity/' + charityId + '/member/' + uid)
        .success(function (charity) {
            $scope.charity = charity;
        });
    };

    //opens donation modal
    $scope.openDonationModal = function ($index, donation) {
        $('#donationModal').modal('show');
        console.log(donation);
    };

    //send payment info to backend
    $scope.confirmPaymentInfo = function (charityName, amount) {
        $('#donationModal').modal('hide');
        $rootScope.charityName = charityName;
        $rootScope.amount = amount;
    };

    //sets userId to clicked charity memember to
    //open that users profile
    $scope.openProfile = function (id) {
        $rootScope.userId = id;
    };

});
