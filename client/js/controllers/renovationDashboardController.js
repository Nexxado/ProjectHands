/**
 * Created by Ruby on 4/4/2016.
 */
angular.module('ProjectHands')
    .controller('renovationDashboardController', function ($scope, $mdDialog) {

        $scope.members = [
            {
                name: 'ruby',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'david',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'dani',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'mike',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'ruby',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'david',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'dani',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'mike',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            }, {
                name: 'ruby',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'david',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'dani',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            },
            {
                name: 'mike',
                role: 'volunteer',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'

            }];

        $scope.messages = [
            {
                content: 'renovationDashboardControllerrenovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController  ',
                sender: 'ruby',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'
            }
            ,
            {
                content: 'renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController  ',
                sender: 'ruby',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'
            }
            ,
            {
                content: 'renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController  ',
                sender: 'ruby',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'
            }
            ,
            {
                content: 'renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController  ',
                sender: 'ruby',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'
            }
            ,
            {
                content: 'renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController renovationDashboardController  ',
                sender: 'ruby',
                role: 'manager',
                imageUrl: 'https://scontent-cdg2-1.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/12523086_575552755928478_5791044670543493931_n.jpg?oh=fe49cfc91c579a052dec8158b72ab7c1&oe=5780F28B'
            }
            ,
        ];

        $scope.tasks = [
            {
                creator: 'a',
                description: 'b',
                created_at: 'c',
                priority: 'high',
                due_date: 'dd',
                executors: []
            }
        ];

        $scope.tools = [
            {
                name: 'hammer'
            },
            {
                name: 'hammer'
            },
            {
                name: 'hammer'
            },
            {
                name: 'hammer'
            },
            {
                name: 'hammer'
            }


        ];

        $scope.inforamtion = {
            description: 'abcbcbcbcb',
            address: 'acscscscsc',
            phone: '050-555-555',
            date: 'acacacacac'
        };

        $scope.showTabDialog = function (ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '/templates/dialogs/create-task-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    // $scope.status = answer;
                    $scope.tasks.push(answer);
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };


    });
function DialogController($scope, $mdDialog) {

    var task = {
        creator: 'a',
        description: 'b',
        created_at: 'c',
        priority: 'high',
        due_date: 'dd',
        executors: []
    };

    var vm = this;
    $scope.announceClick = function(priority) {

        task.priority = priority;

        $scope.task.priority = priority;
    };

    $scope.myDate = new Date();

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {

        task.due_date = $scope.myDate;
        task.description = $scope.task.description ;

        $mdDialog.hide(task);
    };
}


