/**
 * Created by ND88 on 20/05/2016.
 */


module.exports = {

    /**
     * Checks if a 9 Digit ID is a legal Israeli ID
     * @param   {string}  id : 9 digit ID number as string
     * @returns {boolean} : true if legal ID, otherwise false
     * Algorithm:
     * 1) Multiply each ID digit with each corrsponding ID of the check number
     * 2) For any result with 2 digits, add the digits together
     * 3) Sum all the resulting numbers, if the sum is divisble by 10, its legal.
     */
    id: function(id) {
        var check = "121212121";
        var array = [];
        var sum = 0;

        for(var i =  0; i < id.length; i++) {
            var result = parseInt(id.charAt(i)) * parseInt(check.charAt(i));
            array.push(result);
        }

        for(var i = 0; i < array.length; i++) {
            if(array[i] >= 10) {
                var numStr = array[i].toString();
                var result = parseInt(numStr.charAt(0)) + parseInt(numStr.charAt(1));
                array[i] = result;
            }
        }

        for(var i = 0; i < array.length; i++) {
            sum += array[i];
        }


        return !(sum % 10);
    },

    email: function(email){
        //Email Regex according to RFC 5322. - http://emailregex.com/
        var regexEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        return regexEmail.test(email);
    },

    password: function(password) {
        return true;
        //TODO Implement password constraints
    }

};