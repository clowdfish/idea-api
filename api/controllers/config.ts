/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
  activateIntegration: Configuration.activateIntegration
};

/**
 * The user module handling all client requests concerning user profile data.
 */
module Configuration {

  /**
   * Activate the integration given in the payload.
   *
   * @param req
   * @param res
   */
  export function activateIntegration(req, res) {

  }
}