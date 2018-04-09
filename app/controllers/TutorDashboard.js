app.controller('TutorDashboard', function ($scope, $http, $timeout, BaseURL) {
//console.log("I am here");
    $scope.fetch_my_classrooms = function () {
        $http.get(BaseURL + "tutor/classrooms/get_my_classrooms").success(function (data) {
            $scope.classrooms = data;
            $scope.total_classrooms = $scope.classrooms.length;
           console.log($scope.total_classrooms);
        });
    };

    $scope.fetch_my_priced_classrooms = function () {
        $http.get(BaseURL + "tutor/classrooms/get_my_priced_classrooms").success(function (data) {
            $scope.priced_classrooms = data;
            $scope.total_priced_classrooms = $scope.priced_classrooms.length;
             
            //$timeout( function(){ console.log("done"); }, 2000 );
        });
    };

    $scope.fetch_my_free_classrooms = function () {
        $http.get(BaseURL + "tutor/classrooms/get_my_free_classrooms").success(function (data) {
            $scope.free_classrooms = data;
            $scope.total_free_classrooms = $scope.free_classrooms.length;
//            console.log($scope.priced_classrooms);
        });
    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

    //this fetches the data for our table
    $scope.fetchChart = function () {
        $http.get(BaseURL + 'tutor/classrooms/get_chart_data').success(function (res) {
            var ctx = document.getElementById("dvCanvas").getContext('2d');
            var bar = document.getElementById("barCanvas").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'pie', // change the value of pie to doughtnut for doughnut chart
                data: {
                    datasets: [{
                            data: res.total,
                            backgroundColor: ['#e65100', '#ffd180']
                        }],
                    labels: res.type
                },
                options: {
                    responsive: true
                }
            });

            var mybarChart = new Chart(bar, {
                type: 'bar', // change the value of pie to doughtnut for doughnut chart
                data: {
                    labels: res.type,
                    datasets: [{
                            label: 'Your Classrooms',
                            data: res.total,
                            backgroundColor: [
                                '#e65100',
                                '#ffd180'
                            ],
                            borderColor: [
                                'purple',
                                'purple'
                            ],
                            borderWidth: 1
                        }]
                },
                options: {
                    scales: {
                        yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                    }
                }
            });

        });
    };

    $scope.add_new_classroom = function () {
       $http.post(BaseURL + "tutor/classrooms/add_new_classroom", {
            'name': $scope.name,
            'classroom_img': $scope.classroom_img,
            'description': $scope.description
        }).success(function (data) {
            $scope.name = $scope.description = null;
            $scope.classroom_img = "";
            $('#class_modal').modal('close');
            if (data.error) {
                sweetAlert({
                    title: "Error",
                    text: data.message,
                    type: "error",
                    timer: 4000
                });
            } else {
                sweetAlert({
                    title: "Success",
                    text: data.message,
                    type: "success",
                    timer: 4000
                });
                $scope.fetch_my_classrooms();
            }
        }); 
    };

    $scope.show_edit = function (classroom) {
        $scope.edit_classroom_id = classroom['classroom_id'];
        $scope.edit_name = classroom['name'];
        $scope.edit_classroom_img = classroom['classroom_img'];
        $scope.edit_description = classroom['description'];
        $('#edit_class_modal').modal('open');

    };

    $scope.update_classroom = function () {
        $http.post(BaseURL + "tutor/classrooms/edit_classroom", {
            'classroom_id': $scope.edit_classroom_id,
            'name': $scope.edit_name,
            'classroom_img': $scope.edit_classroom_img,
            'description': $scope.edit_description
        }).success(function (data) {
            $('#edit_class_modal').modal('close');
            if (data.error) {
                sweetAlert({
                    title: "Error",
                    text: data.message,
                    type: "error",
                    timer: 4000
                });
            } else {
                sweetAlert({
                    title: "Success",
                    text: data.message,
                    type: "success",
                    timer: 4000
                });
                $scope.fetch_my_classrooms();
            }
        });
    };

    $scope.delete_classroom = function (classroom) {
        sweetAlert({
            title: "Are you sure you want to remove this classroom?",
            text: "You will not be able to recover this classroom and all lessons in it.",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {

                /*delete classroom*/
                $http.post(BaseURL + "tutor/classrooms/delete_classroom", {
                    'classroom_id': classroom['classroom_id']
                }).success(function (data) {
                    if (data.error) {
                        sweetAlert({
                            title: "Error",
                            text: data.message,
                            type: "error",
                            timer: 4000
                        });
                    } else {
                        sweetAlert({
                            title: "Success",
                            text: data.message,
                            type: "success",
                            timer: 4000
                        });
                        $scope.fetch_my_classrooms();
                        $scope.fetch_my_priced_classrooms();
                        $scope.fetch_my_free_classrooms();
                    }
                });
                /*end delete*/

            } else {
                sweetAlert("Cancelled", "You cancelled", "error");
            }
        });
    };

});