import { Promise } from "es6-promise";

import DatabaseHelper = require('../helpers/databaseHelper');
var async = require('async');
var Database = DatabaseHelper.Database;


/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
    addIdea: IdeaController.addIdea,
    getIdea: IdeaController.getIdea,
    getIdeas: IdeaController.getIdeas,
    getLinkToIdea: IdeaController.getLinkToIdea,
    likeIdea: IdeaController.likeIdea,
    addMessage: IdeaController.addMessage
};

/**
 * The idea module handling all client requests concerning idea data.
 */
module IdeaController {

    function makeid(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    /**
     * Add a new idea to the database and return the link to that idea.
     *
     * @param req
     * @param res
     */

    /**
     * title: title,
     * description: description,
     * creator: creator,
     * owners: owners,
     * messages: messages
     */
    export function addIdea(req, res) {

        console.log(req);

        var ideaKey;
        var ideaID;

        // Check if idea exists
        Database.query("SELECT unique_key FROM idea WHERE title='" + req.body.title + "'")
            .then(function (result) {
                //console.log(result);

                if (result.rowCount >= 1) {
                    // Exists
                    ideaID = result.rows[0].id;
                    //return ideaKey;

                    res.status(200).json({
                        key: ideaID,
                        isNew: false
                    });
                    console.log("Already in DB, so END IT HERE!");
                    return new Promise<any>(function(resolve, reject) { reject(null) });

                } else {
                    // does not exist

                    // Generate unique key
                    ideaKey = makeid(50);

                    // INSERT the idea entry in the Database
                    return Database.query("INSERT INTO idea (stage,title,description,unique_key) VALUES ( '1', '" + req.body.title + "', '" + req.body.description + "', '" + ideaKey + "');")
                        .then(function (result) {
                            //console.log("New Entry with Key "+ideaKey);
                            return ideaKey;
                        })
                        .catch(function (err) {
                            console.error(err);
                        });
                }
            })
            .then(function (ideaKey) {
                // Idea is created. Get the ideaID for relations.
                console.log('Getting ideaID');
                return Database.query("SELECT id FROM idea WHERE unique_key='" + ideaKey + "';");

            })
            .then(function (result) {
                console.log(result);

                console.log(result.rows[0].id);
                ideaID = result.rows[0].id;
                // INSERT EMPLOYEES

                var promiseArray = [];
                req.body.owners.forEach(function (owner, indx) {
                    console.log('letsgo! ' + owner);
                    promiseArray.push(do_AddEmployee(req.body.creator, owner, ideaID));
                });

                return Promise.all(promiseArray).then(function () {
                    return ideaID;
                });
            })
            .then(function (ideaID) {
                console.log("INSERTING MESSAGES");
                var sql = "";
                req.body.messages.forEach(function (message, indx) {
                    sql += "INSERT INTO messages (employee_id, idea_id, message) VALUES ((SELECT id FROM employee WHERE email='" + message.email + "'), " + ideaID + ", '" + message.text + "'); ";
                });
                console.log(sql);
                return Database.query(sql)
                    .then(function (result) {
                        console.log("SUCCESS!");
                        console.log(result);
                    })
                    .catch(function (err) {
                        console.log("ERROR!");
                        console.error(err);
                    });

            })
            .then(function () {
                console.log("THIS IS THE END");

                res.status(200).json({
                    key: ideaID,
                    isNew: true
                });
            })
            .catch(function (err) {
                if (err != null)
                    res.status(500).json(err);
            });

        //Database.query("SELECT ...")
        //  .then(function(result) {
        //    console.log(result);
        //  })
        //  .catch(function(err) {
        //    console.error(err);
        //  });

        //res.status(200).send('http://www.dicketitten.com');
    }

    /**
     *
     *
     * @param creator
     * @param owner
     * @param ideaID
     * @returns {}
     */
    function do_AddEmployee(creator, owner, ideaID) {

        return new Promise(function (resolve, reject) {
            Database.query("SELECT id, Name FROM employee WHERE email='" + owner + "'")
                .then(function (result) {
                    if (result.rowCount == 0) {
                        // if not
                        // 1. add him to database
                        console.log("User " + owner + " added.");

                        return Database.query("INSERT INTO employee (client_id, name, surname, email) VALUES (1, '', '', '" + owner + "') RETURNING id");

                        // 2. dispatch welcome email
                        // TODO: email stuff
                    } else {
                        // if exists
                        // get his ID
                        console.log("Already added: ");
                        console.log("User id " + result.rows[0].id + "!");
                        return result;
                    }
                })
                .then(function (result) {
                    var employeeID = result.rows[0].id;

                    // now we have employeeID
                    // 1 creator
                    // 2 owner
                    // 3 contributor

                    var promiseArray = [];

                    // check if creator
                    if (owner == creator) {
                        // yes - add as creator to DB
                        var Promise1 = Database.query("INSERT INTO employee_role (employee_id, role_role_id, idea_id) VALUES (" + employeeID + ",1," + ideaID + ")")
                        promiseArray.push(Promise1);
                    }
                    // add as owner to DB

                    var Promise2 = Database.query("INSERT INTO employee_role (employee_id, role_role_id, idea_id) VALUES (" + employeeID + ",2," + ideaID + ")");
                    promiseArray.push(Promise2);

                    Promise.all(promiseArray)
                        .then(resolve)
                        .catch(function (err) {
                            //console.error(err);
                            console.log("Constraint Error");
                            resolve();
                        });
                })
                .catch(function (err) {
                    console.error(err);
                    reject(err);
                });
        });
    }

    /**
     * Create link to idea with given idea and return in to the client.
     *
     * @param req
     * @param res
     */
    export function getLinkToIdea(req, res) {

        var pathArray = req.path.split('/');
        var ideaId = parseInt(pathArray[pathArray.length - 2]);

        // TODO xreate link
    }

    /**
     * Get idea with given id.
     *
     * @param req
     * @param res
     */
    export function getIdea(req, res) {

        var pathArray = req.path.split('/');
        var ideaId = parseInt(pathArray[pathArray.length - 1]);

        // TODO retrieve idea from database
        /*
        -- DETAILS TO IDEA
        SELECT * FROM idea
        WHERE idea.id=7;

        -- EMPLOYEES TO IDEA
        SELECT e.name, e.surname, e.email, r.title FROM employee e
        INNER JOIN employee_role er ON e.id = er.employee_id
        INNER JOIN role r ON er.role_role_id = r.role_id
        WHERE er.idea_id =7

        -- MESSAGES TO IDEA
        SELECT name, surname, email, date, message
        FROM messages m
        INNER JOIN employee e ON m.employee_id=e.id
        WHERE idea_id = 7
        ORDER BY m.id ASC
        */

        var curIdea;
        var owners;
        var messages;

        // GET DETAILS TO IDEA
        Database.query("SELECT * FROM idea WHERE idea.id="+ideaId+";")
            .then(function(result) {
                // ASSIGN DETAILS TO IDEA
                curIdea = result.rows[0];
                // GET EMPLOYEES TO IDEA
                return Database.query("SELECT e.name, e.surname, e.email, r.title FROM employee e INNER JOIN employee_role er ON e.id = er.employee_id INNER JOIN role r ON er.role_role_id = r.role_id WHERE er.idea_id ="+ideaId+" ");
            })
            .then(function(result) {
                // ASSIGN EMPLOYEES TO IDEA
                owners = result.rows;
                // GET MESSAGES TO IDEA
                return Database.query("SELECT name, surname, email, date, message FROM messages m INNER JOIN employee e ON m.employee_id=e.id WHERE idea_id = 7 ORDER BY m.id ASC");
            })
            .then(function(result) {
                // ASSIGN MESSAGES TO IDEA
                messages = result.rows;

                curIdea.owners = owners;
                curIdea.messages = messages;

                res.status(200).send(curIdea);
            })
            .catch(function (err) {
                if (err != null)
                    res.status(500).json(err);
            });
    }

    /**
     * Get a list of all ideas. Could include a query parameter.
     * NEW: only get ideas relevant to user
     *
     * @param req
     * @param res
     */
    export function getIdeas(req, res) {
        console.log(req);
        var userID = req.body.id

        /*SELECT i.id, i.title as ideaTitle, i.description, i.image, i.unique_key, role.role_id, role.title as roleTitle
         FROM idea i
         INNER JOIN (
         SELECT idea_id, MIN(role_role_id) as dominantRole
         FROM employee_role
         WHERE employee_id = 2
         GROUP BY idea_id
         ) employee_role ON i.id = employee_role.idea_id
         INNER JOIN role ON role.role_id = employee_role.dominantRole*/
        Database.query("SELECT i.id, i.title as ideaTitle, i.description, i.image, i.unique_key, role.role_id, role.title as roleTitle\
                FROM idea i\
                INNER JOIN (\
                    SELECT idea_id, MIN(role_role_id) as dominantRole\
                    FROM employee_role\
                    WHERE employee_id = "+userID+"\
                    GROUP BY idea_id\
                ) employee_role ON i.id = employee_role.idea_id\
                INNER JOIN role ON role.role_id = employee_role.dominantRole")
            .then(function(result) {
                return result;
            })
            .catch(function (err) {
                console.error(err);
            });
        res.status(200).send(req);
    }

    /**
     * Give the idea with the given idea a like.
     *
     * @param req
     * @param res
     */
    export function likeIdea(req, res) {

        var pathArray = req.path.split('/');
        var ideaId = parseInt(pathArray[pathArray.length - 2]);

        // TODO update like counter of idea
    }

    /**
     *
     *
     * @param req
     * @param res
     */
    export function addMessage(req, res) {

        var pathArray = req.path.split('/');
        var ideaId = parseInt(pathArray[pathArray.length - 2]);

        // TODO finish
        Database.query("INSERT INTO messages (employee_id, idea_id, message) VALUES ((SELECT id FROM employee WHERE email='"+req.body.message.employee+"'), "+ideaId+", '"+req.body.message.text+"')")
            .then(function(result) {
                return result;
            })
            .catch(function (err) {
                console.error(err);
            });

    }
}