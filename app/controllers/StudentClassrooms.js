app.controller('StudentClassrooms', function ($scope, $http, BaseURL) {

    $scope.fetch_all_classrooms = function () {
        $http.get(BaseURL + "student/classrooms/get_all_classrooms").success(function (data) {
            $scope.classrooms = data;
//            console.log($scope.classrooms);
        });
    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

});