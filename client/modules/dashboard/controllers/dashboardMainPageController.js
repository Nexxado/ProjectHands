angular.module('ProjectHands.dashboard')

.controller('DashboardMainPageController', function ($scope) {

	$scope.dashboardLinks = [
        {
            state: 'dashboard.all-teams',
            title: 'צוותים',
            desc: 'כל הצוותים של פרויקט ידיים',
            img: 'Teams.png'
        } , {
            state: 'dashboard.renovations',
            title: 'שיפוצים מתוכננים',
            desc: 'כל השיפוצים שמתוכננים בעתיד',
            img: 'Renovations.png'
        } , {
            state: 'dashboard.calendar',
            title: 'לוח שנה',
            desc: 'לוח שנה שמציג את כל האירועים הקרובים',
            img: 'Calendar.png'
        } , {
            state: 'dashboard.statistics',
            title: 'סטטיסטיקות',
            desc: 'סטטיסטיקות של כל הפרויקטים והאנשים של פרויקט ידיים',
            img: 'Statistics.png'
        } , {
            state: 'dashboard.join-requests',
            title: 'בקשות הצטרפות',
            desc: 'כל האנשים שנרשמו וצריכים לקבל אישור הצטרפות',
            img: 'NewMembers.png'
        }
    ]
});
