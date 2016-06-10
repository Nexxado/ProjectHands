/**
 * Created by ND88 on 10/06/2016.
 */
angular.module('ProjectHands')

.filter('translateRole', function(ROLES) {
    return function(role) {
        switch(role) {
            case ROLES.GUEST:
                return 'אורח';
            case ROLES.VOLUNTEER:
                return 'מתנדב';
            case ROLES.TEAM_LEAD:
                return 'מנהל צוות';
            case ROLES.MANAGER:
                return 'מנהל כללי';
            case ROLES.ADMIN:
                return 'אדמין';
            default:
                return 'failed to translate role';
        }
    }
});