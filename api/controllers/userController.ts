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

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getProfile(req, res) {
    res.status(200).send('http://www.dicketitten.com');
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