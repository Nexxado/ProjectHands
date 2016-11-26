/**
 * The matter of emailUtils is to provide a way to send emails to the users such
 * 1- ConfirmationEmail
 * 2- welcomeEmail
 */

var nodemailer = require('nodemailer');
var debug = require('debug')('utils/email');
const email = process.env.EMAIL_ADDR || "projhands@gmail.com";
const password = process.env.EMAIL_PASS || "projecthands123456";

var transporter = nodemailer.createTransport('smtps://' + email + ':' + password + '@smtp.gmail.com');

/**
 * Used to send email to users
 * @param to {string} : the email recipient
 * @param subject {string} : the title of the mail
 * @param content {string}: the body of the mail
 */
function sendMail(to, subject, content) {

    var mailOptions = {
        to: to, // list of receivers
        subject: subject, // Subject line
        text: content, // plaintext body
        html: '<b dir="rtl"><center>' + content + '</center></b>', //+ '<p><img src="cid:logo@projecthands" width="200px" height="200px"><p></center></b>', // html body,
        attachments: [
            {
                filename: 'logo.jpg',
//                path: process.cwd() + '/documents/logo.jpg',
                cid: 'logo@projecthands'
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            debug(error);
            return;
        }
        debug('Message sent: ' + info.response);
    });
}

/**
 * Format date object to string dd/MM/YYYY
 * @param date
 * @returns {string}
 */
function formatDate(date) {
    try {
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();

        if(day < 10)
            day = '0' + day;
        if(monthIndex < 10)
            monthIndex = '0' + monthIndex;

        return day + '/' + monthIndex + '/' + year;
    } catch(error) {
        return date;
    }
}

module.exports = {


    activationEmail: function (to, username, link) {
        var body = '<h1>פרויקט ידיים</h1>' +
            '<h2>היי ' + username + '</h2>' +
            '<h3>תודה שנרשמת לפרויקט ידיים</h3>' +
            '<p>כדי להפעיל את החשבון שלך לחץ על הכפתור למטה</p>' +
            '<a href="' + link + '"><button>הפעל את חשבונך</button></a>';

        sendMail(to, "Activate Account", body);
    },
    resetPasswordEmail: function (to, username, link) {
        var body = '<h1>פרויקט ידיים</h1>' +
            '<h2>היי ' + username + '</h2>' +
            '<h3>התקבלה בקשה לאיפוס סיסמה</h3>' +
            '<p>כדי לאפס את הסיסמה שלך לחץ על הכפתור למטה</p>' +
            '<a href="' + link + '"><button>אפס את הסיסמה </button></a>';

        sendMail(to, "Reset Account password", body);
    },
    changeEmail: function (to, username, link) {
        var body = '<h1>פרויקט ידיים</h1>' +
            '<h2>היי ' + username + '</h2>' +
            '<h3>התקבלה בקשה לשינוי כתובת אמייל</h3>' +
            '<p>כדי לאשר את השינוי לחץ על הכפתור למטה</p>' +
            '<a href="' + link + '"><button>אשר שינוי </button></a>';

        sendMail(to, "Change account email", body);
    },
    changeEmailConfirmation: function (to, username) {
        var body = '<h1>פרויקט ידיים</h1>' +
            '<h2>היי ' + username + '</h2>' +
            '<p>  בקשה לשינוי כתיבת אמייל בוצעה <p>';

        sendMail(to, "Email address has been changed", body);
    },
    renovationReminder: function(to, teamName, renovationAddress, renovationDate) {
        var body = '<h1>פרויקט ידיים - ' + teamName + '</h1>' +
            '<h2>  זו היא תזכורת לגבי שיפוץ בתאריך ' + formatDate(new Date(renovationDate)) +  '<h2>' +
            '<p> בכתובת ' + renovationAddress.street + ' ' + renovationAddress.num + ', ' + renovationAddress.city + '</p>';

        sendMail(to, "Renovation Reminder", body);
    },
    /**
     *After user sign up , he will receive this email
     * @param to : the email recipient
     * @param username : the username of the user
     *
     */
    confirmationEmail: function (to, username) {
        var body = "<center> <h2>Welcome " + username + "</h2> <p> You data has been recored in the system . <br/> Wait a phone call from us to finish the process. <br/> To preview your profile please <a href='#'>click here</a> <br/> Thank you for joining us on our goal </p> </center>"; // html body
        sendMail(to, "Sign up Confirmation", body);

    },
    /**
     *After account has been confirmed , this email will be sent
     * @param to : the email recipient
     * @param username : the username of the user
     */
    welcomeEmail: function (to, username) {
        var body = "<htm> <body> <center> <h2>Welcome aboard " + username + "</h2> <p> Congratulations you are a member in Porject Hands <br/>To start , open the <a href='#'>DASHBOARD</a> <br/> Thank you for joining us </p> </center> </body> </htm>";
        sendMail(to, "Welcome Aboard in Project Hands", body);

    }


};
