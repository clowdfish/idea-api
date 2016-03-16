/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
  addCampaign: CampaignController.addCampaign,
  getCampaign: CampaignController.getCampaign,
  getCampaigns: CampaignController.getCampaigns,
  getIdeasForCampaign: CampaignController.getIdeasForCampaign
};

/**
 * The campaign module handling all client requests concerning campaign data.
 */
module CampaignController {

  /**
   *
   *
   * @param req
   * @param res
   */
  export function addCampaign(req, res) {

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getCampaign(req, res) {

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getCampaigns(req, res) {

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getIdeasForCampaign(req, res) {

  }
}