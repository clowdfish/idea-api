import jwt = require('jwt-simple');

import UserService = require('./userService');

var AuthConfig = require('../config/auth');

/**
 * Checks the API key given with the request object and calls the callback
 * according to its validity.
 *
 * The name of the function is used in the Swagger definition, so it cannot be
 * changed without also changing the Swagger definition file.
 *
 * @param req
 * @param def
 * @param scopes
 * @param callback
 */
export function apiKey(req, def, scopes, callback) {
  var token = req.headers['x-access-token'];

  if (token) {
    try {
      var decoded = jwt.decode(token, AuthConfig.secret);

      // handle token here
      if (decoded.exp <= Date.now()) {
        callback({
          message: 'status.user.error.token.expired',
          statusCode: 403
        });
      }
      else {
        // attach user to request
        UserService
          .getProfile(decoded.iss)
          .then(function (user) {
            req.user = user;
            callback();
          })
          .catch(function(err) {
            throw err;
          });
      }
    } catch (err) {
      console.error('Error while decoding token: ' + err.message);
      callback({
        message: 'status.user.error.token.invalid',
        statusCode: 403
      });
    }
  }
  else {
    console.warn('No token available.');
    callback({
      message: 'status.user.error.authorization.failure',
      statusCode: 401
    });
  }
}
