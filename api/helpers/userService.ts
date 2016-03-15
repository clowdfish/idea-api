import { User } from '../contracts/app.contract';

/**
 * Add password reset token to user data.
 *
 * @param user
 * @param token
 * @param expirationDate
 * @param callback
 */
export function addResetToken(user:User,
                              token:string,
                              expirationDate:string,
                              callback:(error, token, user)=>void) {

  /*
  connection.query('UPDATE user SET reset_password_token = ?, ' +
    'reset_password_expire = ? WHERE id = ?',
    [token, expirationDate, user.id], function(err) {
      callback(err, token, user);
    });
    */
}

/**
 * Retrieve the user profile from the database.
 *
 * @param userId the user id
 */
export function getProfile (userId:number) {

  /*
  return new Promise<User>(function(resolve, reject) {

    connection.query("SELECT * FROM user WHERE id=?;", [userId], function (err, rows) {
      if (err)
        return reject(err);

      if(rows.length) {
        var user:User = {
          id: userId,
          email: rows[0]['email'],
          twitter: rows[0]['twitter_username']
        };

        connection.query("SELECT * FROM profile WHERE id=?;",
          [rows[0]['profile_id']], function (err, rows) {
          if (err)
            return reject(err);

          if(rows.length) {

            var profile = rows[0];

            // copy all profile attributes to user data object
            Object.keys(profile).forEach(function(key) {
              user[key] = this[key];
            }, profile);

            resolve(user);
          }
          else {
            reject(Error('Profile for user with ID=' + userId +
              ' could not be retrieved from database.'));
          }
        });
      }
      else
        reject(Error('User with ID=' + userId +
          ' does not exist in database.'));
    });
  });
  */
}

/**
 * Retrieve user object based on the given email.
 *
 * @param email
 * @param callback
 */
export function getUserFromEmail(email, callback) {

  /*
  connection.query('SELECT * FROM user where email = ?', [email], function(err, users) {
    if (err)
      return callback(err);

    if (!users || users.length == 0)
      return callback(Error('error.email'));

    callback(null, users[0]);
  });
  */
}

/**
 * Extract user id from password reset token and load from database.
 *
 * @param passwordResetToken
 * @param callback
 */
export function getUserFromPasswordResetToken(passwordResetToken:string,
                                              callback:(error, user?)=>void) {

  /*
  connection.query('SELECT * FROM user where reset_password_token = ? ' +
    'AND reset_password_expire > ?',
    [passwordResetToken, moment().format('YYYY-MM-DD HH:mm:ss')],
    function(err, rows) {
      if (err) {
        return callback(err);
      }

      if (!rows || rows.length === 0) {
        return callback(Error('error.invalid.token'));
      }
      callback(null, rows[0]);
    });
    */
}

/**
 * Reset the password for the given user object.
 *
 * @param user
 * @param password
 * @param callback
 */
export function resetUserPassword(user:any,
                                  password:string,
                                  callback:(error:any, user?:any)=>void) {

  /*
  connection.query('UPDATE user set password = ?, ' +
    'reset_password_expire = null, reset_password_token = null WHERE id = ?',
    [password, user.id], function(err) {
      if(err)
        return callback(err);

      callback(null, user);
    });
    */
}
