/**
 * The app controller handling the app routes.
 */
var Configuration;
(function (Configuration) {
    /**
     * Activates the integration given in the payload.
     *
     * @param req
     * @param res
     */
    function activateIntegration(req, res) {
        res.sendStatus(200);
    }
    Configuration.activateIntegration = activateIntegration;
})(Configuration || (Configuration = {}));
module.exports = {
    activateIntegration: Configuration.activateIntegration
};
//# sourceMappingURL=config.js.map