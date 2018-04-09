app.controller('TutorStudents', function ($scope, $http, BaseURL) {

    $scope.fetch_students_in_class = function (id) {
        $http.get(BaseURL + "tutor/students/get_students_in_class/"+id).success(function (data) {
            $scope.students = data;
//            console.log($scope.students);
        });
    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

});