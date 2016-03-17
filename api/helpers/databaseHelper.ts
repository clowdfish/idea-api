import pg = require('pg');
import { Promise } from "es6-promise";

var dbConfig = require('../config/database');

// example: "postgres://username:password@localhost/database"
var connectionString = "postgres://"
    + dbConfig.connection.username + ":"
    + dbConfig.connection.password + "@"
    + dbConfig.connection.host + ":"
    + dbConfig.connection.port + "/"
    + dbConfig.connection.database + "?ssl=true";

/**
 * Database wrapper for the PostgreSQL database.
 */
export class Database {

  /**
   *
   *
   * @param query
   * @returns
   */
  static query(query:string):Promise<any> {

    return new Promise<any>(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.error('Error fetching client from pool: ', err);
          return reject(err);
        }

        client.query(query, function (err, result) {
          done(); //  release the client back to the pool

          if (err) {
            console.error('Error running query: ', err);
            return reject(err);
          }

          resolve(result);
        });
      });
    });
  }
}