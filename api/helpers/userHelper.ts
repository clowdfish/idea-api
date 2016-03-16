import { User } from '../contracts/app.contract';

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
