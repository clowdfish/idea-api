import DatabaseHelper = require('../helpers/databaseHelper');
var Database = DatabaseHelper.Database;

/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
  getIdeasRelatedToUser: UserController.getIdeasRelatedToUser,
  getProfile: UserController.getProfile,
  updateProfile: UserController.updateProfile
};

/**
 * The user module handling all client requests concerning user profile data.
 */
module UserController {

  /**
   *
   *
   * @param req
   * @param res
   */

  export function getIdeasRelatedToUser(req, res) {
    //route: /me/ideas
    var userID:string;
    if (req.query.id) {
      userID = req.query.id;
    } else {
      userID = "2";
    }

    //  Idea data structure

    //  id:number
    //  ideatitle:string
    //  description
    //  image
    //  unique_key:string
    //  role_id
    //  roletitle
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
          res.status(200).send(result.rows);
        })
        .catch(function(err) {
          console.error(err);
          res.status(200).send('http://www.dicketitten.com');
        });
  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getProfile(req, res) {
    var userID:string;
    if (req.query.id) {
      userID = req.query.id;
    } else {
      userID = "2";
    }

    Database.query("SELECT * FROM employee WHERE id="+userID)
      .then(function(result) {
        res.status(200).send(result.rows[0]);
      })
      .catch(function(err) {
        console.error(err);
        res.status(200).send('http://www.dicketitten.com');
      });


  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function updateProfile(req, res) {

  }
}