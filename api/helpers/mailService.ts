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
export function sendPasswordResetConfirmation(email:string, subject:string, message:string,  callback:(err)=>void) {

  var transporter = nodeMailer.createTransport(AuthConfig.nodeMailer.mandrill);

  var mailOptions = {
    to: email,
    from: AuthConfig.mailOptions.supportEmail,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(err) {
    callback(err);
  });
}

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
export function sendPasswordResetLink(email:string,
                                      subject:string,
                                      token:string,
                                      originUrl:string,
                                      callback:(err)=>void) {

  var transporter = nodeMailer.createTransport(AuthConfig.nodeMailer.mandrill);

  var mailOptions = {
    to: email,
    from: AuthConfig.mailOptions.supportEmail,
    subject: subject,
    text: "Klick the link to reset: " +
      originUrl + '/en/#/reset-password/' + token
  };

  transporter.sendMail(mailOptions, function(err) {
    callback(err);
  });
}