app.controller('TutorConsultations', function ($scope, $http, BaseURL) {

    $scope.loadName = 'Load More ...';
    $scope.fetch_consultations = function (id) {
        $http.get(BaseURL + "tutor/consultations/get_consultations_by_class/" + id)
                .success(function (data) {
                    $scope.consultations = data;
                    console.log($scope.consultations);
                });
    };

    $scope.load_more_consultations = function (id) {
        var lastid = $scope.consultations.length - 1;
        var lastobj = $scope.consultations[lastid];
        $http.get(BaseURL + "tutor/consultations/load_more_consultations_by_class/" + id + "/" + lastobj['consultation_id'])
                .success(function (data) {
                    if (data == '') {
                        $scope.loadName = 'No more Consultations to Load';
                    }
                    else {
                        angular.forEach(data, function (newconsultation) {
                            $scope.consultations.push(newconsultation);
                        });
                    }
                    console.log($scope.consultations);
                });
    }

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

});