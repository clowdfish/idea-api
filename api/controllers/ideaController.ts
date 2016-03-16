/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
  addIdea: IdeaController.addIdea,
  getIdea: IdeaController.getIdea,
  getIdeas: IdeaController.getIdeas,
  likeIdea: IdeaController.likeIdea
};

/**
 * The idea module handling all client requests concerning idea data.
 */
module IdeaController {

  /**
   *
   *
   * @param req
   * @param res
   */
  export function addIdea(req, res) {

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getIdea(req, res) {

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function getIdeas(req, res) {

  }

  /**
   *
   *
   * @param req
   * @param res
   */
  export function likeIdea(req, res) {

  }
}