angular.module('ProjectHands')

.service('UtilsService', function() {


    //Change date object to HH:MM format
    function parseTimestamp(timestamp) {
        var date = new Date(timestamp);
        var minutes = date.getMinutes();
        var hours = date.getHours();
        if (minutes < 10)
            minutes = '0' + minutes;
        if (hours < 10)
            hours = '0' + hours;

        return hours + ':' + minutes;
    }

    return {
        parseTimestamp: parseTimestamp
    };
});
