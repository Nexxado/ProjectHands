/**
 * The matter of emailUtils is to provide a way to send emails to the users such
 * 1- ConfirmationEmail
 * 2- welcomeEmail
 */

var nodemailer = require('nodemailer');
const  email = "projhands@gmail.com";
const password = "projecthands123456";

var transporter = nodemailer.createTransport('smtps://'+email+':'+password+'@smtp.gmail.com');

/**
 * Used to send email to users
 * @param to : the email recipient
 * @param subject : the title of the mail
 * @param content : the body of the mail
 */
function sendMail (to,subject,content)
{
    var mailOptions = {
        to: to, // list of receivers
        subject: subject, // Subject line
        text: content, // plaintext body
        html: '<b>'+content+'</b>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
module.exports =
{


    /**
     *After user sign up , he will receive this email
     * @param to : the email recipient
     * @param username : the username of the user
     *
     */
    confirmationEmail : function (to , username)
    {
        var body = "<center> <h2>Welcome "+username+"</h2> <p> You data has been recored in the system . <br/> Wait a phone call from us to finish the process. <br/> To preview your profile please <a href='#'>click here</a> <br/> Thank you for joining us on our goal </p> </center>"; // html body
        sendMail(to,"Sign up Confirmation",body);

    },
    /**
     *After account has been confirmed , this email will be sent
     * @param to : the email recipient
     * @param username : the username of the user
     */
    welcomeEmail : function (to , username)
    {
        var body = "<htm> <body> <center> <h2>Welcome aboard "+username+"</h2> <p> Congratulations you are a member in Porject Hands <br/>To start , open the <a href='#'>DASHBOARD</a> <br/> Thank you for joining us </p> </center> </body> </htm>";
        sendMail(to,"Welcome Aboard in Project Hands",body);

    }


};