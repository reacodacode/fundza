app.controller('StudentDashboard', function ($scope, $http, BaseURL) {

    $scope.fetch_my_classrooms = function (id) {
        $http.get(BaseURL + "student/classrooms/get_my_classrooms").success(function (data) {
            $scope.myclassrooms = data;
            $scope.mytotal = $scope.myclassrooms.length;
        });
    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

});