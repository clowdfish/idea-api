import { Promise } from 'es6-promise';

import mysql = require('mysql');
import bcrypt = require('bcrypt');
import { User } from "../contracts/app.contract";

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load the auth variables
var dbConfig = require('../config/database');

var connection = mysql.createConnection(dbConfig.connection);

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM user WHERE id = ? ;", [id], function(err, rows) {
      done(err, rows[0]);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',

    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("SELECT * FROM user WHERE email = ? ;", [email], function(err, rows) {
          if (err)
            return done(err);

          if (rows.length) {
            return done(null, false, {message: 'status.user.error.signup.exists'});
          } else {
            //temp salt
            var salt = bcrypt.genSaltSync(10);
            // if there is no user with that username
            // create the user
            var newUser = {
              id: undefined,
              email: email,
              password: bcrypt.hashSync(password, salt)  // use the generateHash function in our user model
            };

            var insertQuery = "INSERT INTO user ( email, password ) VALUES (?,?); ";

            connection.query(insertQuery, [newUser.email, newUser.password],function(err, rows) {
              newUser.id = rows.insertId;

              createUserData(rows.insertId)
                .then(function() {
                  // attach user to request
                  req.user = newUser; // required to work with req.user in subsequent middle wares
                  return done(null, newUser);
                })
                .catch(function(err) {
                  return done(err);
                });
            });
          }
        });
      })
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) { // callback with email and password from our form
        connection.query("SELECT * FROM user WHERE email = ? ;", [email], function(err, rows){
          if (err)
            return done(err);

          // if no user is found, return the message
          if (!rows.length) {
            return done(null, false, {message: 'status.user.error.signin.username'});
          }

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, {message: 'status.user.error.signin.password'});

          // all is well, return successful user
          return done(null, rows[0]);
        });
      })
  );
};

/**
 * Create user data for new user.
 *
 * @param userId
 * @returns {Promise}
 */
function createUserData(userId):Promise<User> {
  return new Promise<User>(function(resolve, reject) {

    connection.query("INSERT INTO profile (first_name, last_name) VALUES (?, ?);", ["", ""], function (err, rows) {
      if (err)
        reject(err);

      var profileId = rows.insertId;

      // add profile id to user data
      connection.query("UPDATE user SET profile_id=? WHERE id=?;", [profileId, userId], function (err, rows) {
        if (err)
          reject(err);

        resolve(rows);
      });
    });
  });
}