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
        templateUrl: 'templates/dashboard/main-page.html'
    })
    
    .state('dashboard.tasks', {
        url: '/main-page',
        templateUrl: 'templates/dashboard/tasks.html'
    })
    
    .state('dashboard.renovations', {
        url: '/main-page',
        templateUrl: 'templates/dashboard/renovations.html'
    })
    
    .state('dashboard.toolbox', {
        url: '/main-page',
        templateUrl: 'templates/dashboard/toolbox.html'
    })
    
    .state('dashboard.team', {
        url: '/main-page',
        templateUrl: 'templates/dashboard/team.html'
    })
    
    .state('dashboard.calendar', {
        url: '/main-page',
        templateUrl: 'templates/dashboard/calendar.html'
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
