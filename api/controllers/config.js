/**
 * The user module handling all client requests concerning user profile data.
 */
var Configuration;
(function (Configuration) {
    /**
     * Activate the integration given in the payload.
     *
     * @param req
     * @param res
     */
    function activateIntegration(req, res) {
    }
    Configuration.activateIntegration = activateIntegration;
})(Configuration || (Configuration = {}));
module.exports = {
    activateIntegration: Configuration.activateIntegration
};
//# sourceMappingURL=config.js.map