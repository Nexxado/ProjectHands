angular.module('ProjectHands')

.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })

    .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html'

    })
    
     .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard/dashboard.html',
        controller: 'DashboardController',
        deepStateRedirect: {
            default: {
                state: 'dashboard.main-page'
            }
        }

    })
    
    .state('dashboard.main-page', {
        url: '/main-page',
        templateUrl: 'templates/dashboard/main-page.html',
        controller: 'DashboardMainPageController'
    })
    
    .state('dashboard.tasks', {
        url: '/tasks',
        templateUrl: 'templates/dashboard/tasks.html'
    })
    
    .state('dashboard.renovations', {
        url: '/renovations',
        templateUrl: 'templates/dashboard/renovations.html'
    })
    
    .state('dashboard.toolbox', {
        url: '/toolbox',
        templateUrl: 'templates/dashboard/toolbox.html'
    })
    
    .state('dashboard.team', {
        url: '/team',
        templateUrl: 'templates/dashboard/team.html'
    })
    
    .state('dashboard.calendar', {
        url: '/calendar',
        templateUrl: 'templates/dashboard/calendar.html'
    })
    
        .state('dashboard.statistics', {
        url: '/statistics',
        templateUrl: 'templates/dashboard/statistics.html'
    })
    
        .state('dashboard.all-teams', {
        url: '/all-teams',
        templateUrl: 'templates/dashboard/all-teams.html'
    })
    
        .state('dashboard.renovations-ref', {
        url: '/renovations-ref',
        templateUrl: 'templates/dashboard/renovations-ref.html'
    })
    
        .state('dashboard.store-supporters', {
        url: '/store-supporters',
        templateUrl: 'templates/dashboard/store-supporters.html'
    })
    
        .state('dashboard.join-requests', {
        url: '/join-requests',
        templateUrl: 'templates/dashboard/join-requests.html'
    })

    .state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html'

    })

    .state('about', {
        url: '/about',
        templateUrl: 'templates/about/index.html',
        controller: 'AboutController',
        deepStateRedirect: {
            default: {
                state: 'about.who'
            }
        }
    })

    .state('about.who', {
        url: '/who',
        templateUrl: 'templates/about/who.html'
    })

    .state('about.jobs', {
        url: '/jobs',
        templateUrl: 'templates/about/jobs.html'
    })

    .state('about.contact', {
        url: '/contact',
        templateUrl: 'templates/about/contact.html'
    });


});
