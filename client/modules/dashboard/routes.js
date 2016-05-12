angular.module('ProjectHands.dashboard')

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/dashboard/templates/dashboard.html',
        controller: 'DashboardController',
        deepStateRedirect: {
            default: {
                state: 'dashboard.main-page'
            }
        },
        resolve: {
            auth: function($rootScope) {
                return $rootScope.authenticate('dashboard');
            }
        }
    })

    .state('dashboard.main-page', {
        url: '/main-page',
        templateUrl: 'modules/dashboard/templates/main-page.html',
        controller: 'DashboardMainPageController'
    })

    .state('dashboard.tasks', {
        url: '/tasks',
        templateUrl: 'modules/dashboard/templates/tasks.html'
    })

    .state('dashboard.renovations', {
        url: '/renovations',
        templateUrl: 'modules/dashboard/templates/renovations.html'
    })

    .state('dashboard.toolbox', {
        url: '/toolbox',
        templateUrl: 'modules/dashboard/templates/toolbox.html',
        controller: 'DashboardToolboxController'
    })

    .state('dashboard.team', {
        url: '/team',
        templateUrl: 'modules/dashboard/templates/team.html'
    })

    .state('dashboard.calendar', {
        url: '/calendar',
        templateUrl: 'modules/dashboard/templates/calendar.html'
    })

    .state('dashboard.userProfile', {
        url: '/userProfile',
        templateUrl: 'modules/dashboard/templates/userProfile.html',
        controller: 'DashboardUserProfileController'
    })

    .state('dashboard.statistics', {
        url: '/statistics',
        templateUrl: 'modules/dashboard/templates/statistics.html'
    })

    .state('dashboard.all-teams', {
        url: '/all-teams',
        templateUrl: 'modules/dashboard/templates/all-teams.html'
    })

    .state('dashboard.renovations-ref', {
        url: '/renovations-ref',
        templateUrl: 'modules/dashboard/templates/renovations-ref.html'
    })

    .state('dashboard.store-supporters', {
        url: '/store-supporters',
        templateUrl: 'modules/dashboard/templates/store-supporters.html'
    })

    .state('dashboard.join-requests', {
        url: '/join-requests',
        templateUrl: 'modules/dashboard/templates/join-requests.html'
    })

    .state('dashboard.chat', {
        url: '/chat',
        template: '<chat user="getMemberName(myID)" rooms="rooms"></chat>'
    });
});
