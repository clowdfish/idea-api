var nodeMailer = require('nodemailer');
var AuthConfig = require('../config/auth');
/**
 * Creates an email telling the user, that his password was changed.
 *
 * @param email
 * @param subject
 * @param message
 * @param callback
 */
function sendPasswordResetConfirmation(email, subject, message, callback) {
    var transporter = nodeMailer.createTransport(AuthConfig.nodeMailer.mandrill);
    var mailOptions = {
        to: email,
        from: AuthConfig.mailOptions.supportEmail,
        subject: subject,
        text: message
    };
    transporter.sendMail(mailOptions, function (err) {
        callback(err);
    });
}
exports.sendPasswordResetConfirmation = sendPasswordResetConfirmation;
/**
 * Creates an email containing a sepcific token for the user who requested a
 * password reset.
 *
 * @param email
 * @param subject
 * @param token
 * @param originUrl
 * @param callback
 */
function sendPasswordResetLink(email, subject, token, originUrl, callback) {
    var transporter = nodeMailer.createTransport(AuthConfig.nodeMailer.mandrill);
    var mailOptions = {
        to: email,
        from: AuthConfig.mailOptions.supportEmail,
        subject: subject,
        text: "Klick the link to reset: " +
            originUrl + '/en/#/reset-password/' + token
    };
    transporter.sendMail(mailOptions, function (err) {
        callback(err);
    });
}
exports.sendPasswordResetLink = sendPasswordResetLink;
//# sourceMappingURL=mailService.js.map