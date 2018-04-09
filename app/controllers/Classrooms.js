/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.filter('trusted', ['$sce', function ($sce) {
        var div = document.createElement('div');
        return function (text) {
            div.innerHTML = text;
            return $sce.trustAsHtml(div.textContent);
        };
    }]);

app.controller('LessonCtrl', function ($scope, $http, $timeout, $window, BaseURL, quizFactory) {

    $scope.lesson_no = 0;
    $scope.question_no = 0;
    $scope.lessons = [];

    $scope.fetch_lessons = function (id) {
        $http.get(BaseURL + "learn/get_lessons/" + id).success(function (data) {
            $scope.lessons = data;
            $scope.total_lessons = $scope.lessons.length;
            if ($scope.total_lessons < 1) {
                $window.location.href = BaseURL + "student/classrooms";
            }
            $scope.getLesson();
        });
    };

    $scope.getLesson = function () {
        $scope.current_lesson = $scope.lessons[$scope.lesson_no];
//        console.log($scope.current_lesson);
        $scope.fetch_unlocked_lessons($scope.current_lesson.classroom_id);
        quizFactory.setTest($scope.current_lesson.lesson_id);
    };

    $scope.nextLesson = function () {
        $scope.unlock_lesson($scope.current_lesson.lesson_id);
        $scope.lesson_no++;
        if ($scope.lesson_no >= $scope.total_lessons) {
            $scope.lesson_no = 0;
        }
        $scope.getLesson();
        $scope.openPlan();
        $scope.reset();
    };

    $scope.getIndex = function (id) {
        for (i = 0; i < $scope.lessons.length; i++) {
            if ($scope.lessons[i].lesson_id == id) {
                return i;
            }
        }
        return -1;
    };

    $scope.setCurrentLesson = function (id) {
        var index = $scope.getIndex(id);
        if (index != -1) {
            $scope.lesson_no = index;
        } else {
            $scope.lesson_no = 0;
        }
        $scope.getLesson();
    };

    $scope.unlock_lesson = function (id) {
        $http.get(BaseURL + "learn/unlock_lesson/" + id).success(function (data) {
            console.log(data);
        });
    };

    $scope.openPlan = function () {
        $scope.lesson_content = $scope.lesson_quiz = false;
        $scope.lesson_plan = true;
    };

    $scope.openContent = function () {
        $scope.lesson_plan = $scope.lesson_quiz = false;
        $scope.lesson_content = true;
    };

    $scope.openQuiz = function () {
        $scope.lesson_plan = $scope.lesson_content = false;
        $scope.reset();
        $scope.lesson_quiz = true;
    };

    $scope.openPlan();


    $scope.getQuestion = function () {
        var q = quizFactory.getQuestion($scope.question_no);
        if (q) {
            $scope.question = q.question;
            $scope.answer = q.answer;
            $scope.answerMode = true;
        } else {
            $scope.testOver = true;
        }
    };

    $scope.startTest = function () {
        $scope.question_no = 0;
        $scope.testOver = false;
        $scope.inProgress = true;
        $scope.total_questions = quizFactory.getLength();
        $scope.getQuestion();
    };

    $scope.reset = function () {
        $scope.inProgress = false;
        $scope.score = 0;
        $scope.quiz = [];
    };
    $scope.reset();

    $scope.checkAnswer = function () {
//        console.log($scope.test.option);
        if (!$scope.quiz.option)
            return;

        var ans = $scope.quiz.option;

        if (ans == $scope.answer) {
            $scope.score++;
            $scope.correctAns = true;
        } else {
            $scope.correctAns = false;
        }

        $scope.answerMode = false;
        $timeout(function () {
            $scope.nextQuestion();
        }, 2000);

    };

    $scope.nextQuestion = function () {
        $scope.question_no++;
        $scope.getQuestion();
    };

    $scope.fetch_unlocked_lessons = function (id) {
        $http.get(BaseURL + "learn/get_unlocked_lessons/" + id).success(function (data) {
            $scope.unlocked_lessons = data;
//            console.log($scope.unlocked_lessons);
        });
    };

});


app.controller('TestCtrl', function ($scope, $timeout, testFactory) {

    $scope.test_id = $("#test_id").val();
    testFactory.setTest($scope.test_id);

    $scope.getQuestion = function () {
        var q = testFactory.getQuestion($scope.question_no);
        if (q) {
            $scope.question = q.question;
            $scope.answer = q.answer;
            $scope.answerMode = true;
        } else {
            $scope.testOver = true;
        }
    };

    $scope.startTest = function (id) {
        $scope.question_no = 0;
        $scope.current_test_id = id;
        $scope.testOver = false;
        $scope.inProgress = true;
        $scope.total_questions = testFactory.getLength();
        $scope.getQuestion();
    };

    $scope.reset = function (id) {
        $scope.inProgress = false;
        $scope.score = 0;
        $scope.current_test_id = id;
        $scope.test = [];
    };
    $scope.reset($scope.test_id);

    $scope.checkAnswer = function () {
        if (!$scope.test.option)
            return;

        var ans = $scope.test.option;

        if (ans == $scope.answer) {
            $scope.score++;
            $scope.correctAns = true;
        } else {
            $scope.correctAns = false;
        }

        $scope.answerMode = false;
        $timeout(function () {
            $scope.nextQuestion();
        }, 5000);

    };

    $scope.nextQuestion = function () {
        $scope.question_no++;
        $scope.getQuestion();
    };


});

app.factory('quizFactory', function ($http, $q, $timeout, BaseURL) {
    var questions = [];

    return {
        setTest: function (id) {
            questions = [];
            $http.get(BaseURL + 'learn/get_lesson_quiz/' + id).then(function (res) {
                questions = res.data;
//                console.log(questions);
            });
        },
        getQuestion: function (id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        },
        getLength: function () {
            return questions.length;
        }
    };
});

app.factory('testFactory', function ($http, $q, $timeout, BaseURL) {
    var questions = [];

    return {
        setTest: function (id) {
            questions = [];
            $http.get(BaseURL + 'learn/get_test_questions/' + id).then(function (res) {
                questions = res.data;
                console.log(questions);
            });
        },
        getQuestion: function (id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        },
        getLength: function () {
            return questions.length;
        }
    };
});

