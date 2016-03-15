/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
  activateIntegration: Configuration.activateIntegration
};

/**
 * The app controller handling the app routes.
 */
module Configuration {

  /**
   * Activates the integration given in the payload.
   *
   * @param req
   * @param res
   */
  export function activateIntegration(req, res) {
    res.sendStatus(200);
  }
}