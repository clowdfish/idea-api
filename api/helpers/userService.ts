import { User } from '../contracts/app.contract';
import { UserPreference, Favorite, TravelOption } from '../contracts/ttg.contract';

import { Promise } from 'es6-promise';
import { Moment } from 'moment';
import * as moment from 'moment';

import mysql = require('mysql');

import fs = require('fs');
import path = require('path');

var dbConfig = require('../config/database');
var connection = mysql.createConnection(dbConfig.connection);

/**
 * Add new favorite for user with given userId.
 *
 * @param userId
 * @param favorite
 * @returns {Promise}
 */
export function addFavorite(userId:number,
                            favorite:Favorite) {

  return new Promise(function(resolve, reject) {

    var queryString:string;
    var queryParams:any[];

    if(favorite.id) {
     reject(Error('Cannot add a new favorite with a given id.'));
    }
    else {
      // create new favorite
      queryString =
        "INSERT INTO favorite " +
        "(user_id, start, start_location_latitude, start_location_longitude," +
        " end, end_location_latitude, end_location_longitude, transport) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

      queryParams = [
        userId,
        favorite.origin.description,
        favorite.origin.location.latitude,
        favorite.origin.location.longitude,
        favorite.destination ? favorite.destination.description : "",
        favorite.destination ? favorite.destination.location.latitude : "",
        favorite.destination ? favorite.destination.location.longitude : ""
      ];

      var transport = favorite.transport || TravelOption.undefined;
      queryParams.push(transport);

      connection.query(queryString, queryParams, function (err, result) {
          if (err)
            return reject(err);

          resolve();
        }
      );
    }
  });
}

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

  connection.query('UPDATE user SET reset_password_token = ?, ' +
    'reset_password_expire = ? WHERE id = ?',
    [token, expirationDate, user.id], function(err) {
      callback(err, token, user);
    });
}

/**
 * Delete favorite with the given favoriteId for the user with the given
 * userId.
 *
 * @param userId
 * @param favoriteId
 * @returns {Promise}
 */
export function deleteFavorite(userId:number,
                               favoriteId:number) {

  return new Promise(function(resolve, reject) {

    var queryString =
      "DELETE FROM favorite " +
      "WHERE user_id=? AND id=?;";

    connection.query(queryString, [userId, favoriteId], function (err, result) {
      if (err)
        return reject(err);

      if(result.affectedRows)
        resolve();
      else
        reject(Error('Could not delete the favorite.'));
    });
  });
}

/**
 * Retrieve all favorites for the user with the given userId from the database.
 *
 * @param userId
 * @returns {Promise}
 */
export function getFavorites(userId:number) {

  return new Promise(function(resolve, reject) {

    connection.query("SELECT * FROM favorite " +
      "WHERE user_id=? ORDER BY position, id;",
      [userId], function (err, rows) {

        if (err)
          return reject(err);

        if(rows.length) {
          var favoritesArray = [];

          rows.forEach(function(row) {

            favoritesArray.push({
              "id" : row['id'],
              "origin" : {
                "description" : row['start'],
                "location": {
                  "latitude": row['start_location_latitude'],
                  "longitude": row['start_location_longitude']
                }
              },
              "destination" : {
                "description" : row['end'],
                "location": {
                  "latitude": row['end_location_latitude'],
                  "longitude": row['end_location_longitude']
                }
              },
              position: row['position']
            });
          });

          resolve(favoritesArray);
        }
        else {
          resolve([]);
        }
    });
  });
}

/**
 * Retrieve the user profile from the database.
 *
 * @param userId the user id
 */
export function getProfile (userId:number):Promise<User> {

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
}

/**
 * Retrieve user object based on the given email.
 *
 * @param email
 * @param callback
 */
export function getUserFromEmail(email, callback) {

  connection.query('SELECT * FROM user where email = ?', [email], function(err, users) {
    if (err)
      return callback(err);

    if (!users || users.length == 0)
      return callback(Error('error.email'));

    callback(null, users[0]);
  });
}

/**
 * Extract user id from password reset token and load from database.
 *
 * @param passwordResetToken
 * @param callback
 */
export function getUserFromPasswordResetToken(passwordResetToken:string,
                                              callback:(error, user?)=>void) {

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

  connection.query('UPDATE user set password = ?, ' +
    'reset_password_expire = null, reset_password_token = null WHERE id = ?',
    [password, user.id], function(err) {
      if(err)
        return callback(err);

      callback(null, user);
    });
}

/**
 * Retrieve all user settings from the database.
 *
 * @param userId
 * @returns {Promise}
 */
export function getUserSettings(userId:number) {

  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM setting where user_id = ?", [userId],
      function(err, rows) {
        if (err)
          return reject(err);

        var settings = [];
        for(var i = 0; i < rows.length; i++) {
          settings.push({
            key: rows[i].key,
            value: rows[i].value,
            category: rows[i].category || "",
            description: rows[i].description || ""
          });
        }

        resolve(settings);
      });
  });
}

/**
 * Delete the old profile image from the hard disk.
 *
 * @param profileId
 * @returns {Promise}
 */
function deleteOldProfileImage(profileId:number) {

  return new Promise(function(resolve, reject) {

    connection.query('SELECT * FROM profile where id = ?', [profileId],
      function(err, profiles) {
        if (err)
          return reject(err);

        if (profiles.length > 0) {
          var image = profiles[0]['image'];

          if (image) {
            var systemPath = path.join(__dirname, '/../../static/', image);

            fs.exists(systemPath, function(exists) {
              if (exists)
                fs.unlinkSync(systemPath);

              resolve();
            });
          } else {
            resolve();
          }
        } else {
          resolve();
        }
    });
  });
}

/**
 * Update user profile with given profile object.
 *
 * @param userId
 * @param profileObject
 * @returns {Promise}
 */
export function setProfile(userId:number, profileObject:any) {

  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM user WHERE id=?;", [userId],
      function (err, rows) {
        if (err)
          return reject(err);

        if (rows.length === 0)
          return reject(Error("User with ID=" + userId + " does not exist."));

        var profileId = rows[0]['profile_id'];
        var updateFields = [
          'company_name',
          'first_name',
          'last_name',
          'street',
          'address_other',
          'zip_code',
          'city',
          'country',
          'language'
        ];

        if (updateFields.indexOf(profileObject.key) === -1)
          reject(Error('Invalid parameters'));

        var updateQuery = 'UPDATE profile SET ?? = ? where id = ?';
        var updateParams = [
          profileObject['key'],
          profileObject['value'],
          profileId
        ];

        connection.query(updateQuery, updateParams, function(err) {
          if (err)
            return reject(err);

          resolve();
        });
    });
  });
}

/**
 * Update the favorite with the given favorite Id.
 *
 * @param userId
 * @param favoriteId
 * @param favorite
 * @returns {Promise}
 */
export function updateFavorite(userId:number,
                               favoriteId:number,
                               favorite:Favorite) {

  return new Promise(function(resolve, reject) {

    var queryString:string;
    var queryParams:any[];

    if(favorite.id != favoriteId)
      console.warn('Given favorite id is different from the favorite itself.');

    // update favorite (currently only position is updated)
    queryString =
      "UPDATE favorite SET position = ? WHERE id = ? and user_id = ?";

    queryParams = [
      favorite.position || 0,
      favoriteId,
      userId
    ];

    connection.query(queryString, queryParams, function(err) {
      if (err)
        return reject(err);

      resolve();
    });
  });
}

/**
 * Save the given path of the profile image to the user profile.
 *
 * @param userId
 * @param relativePath
 * @returns {Promise}
 */
export function updateProfileImage(userId:number,
                                   relativePath:string) {

  return new Promise(function(resolve, reject) {

    connection.query('SELECT * FROM user WHERE id = ?', [userId],
      function(err, rows) {
        if (err)
          return reject(err);

        if (rows.length == 0)
          return reject(Error('User does not exist.'));

        var profileId = rows[0]['profile_id'];

        deleteOldProfileImage(profileId)
          .then(function() {
            var updateQuery = 'UPDATE profile SET image = ? WHERE id = ?';
            var updateParams = [relativePath, profileId];

            connection.query(updateQuery, updateParams, function(err, data) {
              if (err)
                return reject(err);

              resolve(relativePath);
            });
          })
          .catch(function(err) {
            reject(err);
          });
      });
  });
}

/**
 * Update one specific user setting given by the setting argument.
 *
 * @param userId
 * @param setting
 * @returns {Promise}
 */
export function updateUserSettings(userId:number,
                                   setting:UserPreference) {

  return new Promise(function(resolve, reject) {

    connection.query("SELECT * FROM setting where `key` in (?) and user_id = ?",
      [setting.key, userId], function(err, rows) {

        if (err)
          return reject(err);

        var query;
        var params;

        if (rows.length > 0) {
          query = 'UPDATE setting SET `value` = ?, `category` = ?, ' +
            '`description` = ? WHERE `key` = ? AND `user_id` = ?';

          params = [
            setting.value,
            setting.category,
            setting.description,
            setting.key,
            userId];
        }
        else {
          query = 'INSERT INTO setting(`user_id`, `key`, `value`, `category`,' +
            ' `description`) VALUES(?, ?, ?, ?, ?)';

          params = [
            userId,
            setting.key,
            setting.value,
            setting.category,
            setting.description];
        }

        connection.query(query, params, function(err) {
          if (err)
            return reject(err);

          resolve();
        });
      });
  });
}