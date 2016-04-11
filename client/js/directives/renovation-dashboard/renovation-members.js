angular.module('ProjectHands')

.directive('renovationMembers', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/renovation-dashboard/renovation-members.html',
        controller: function($scope) {
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

                },{
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

                }]
            
        }
    };
});
 
