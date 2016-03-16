/**
 * The export section is necessary to make the functions available to the
 * Swagger generated routes.
 */
export = {
  addIdea: IdeaController.addIdea,
  getIdea: IdeaController.getIdea,
  getIdeas: IdeaController.getIdeas,
  getLinkToIdea: IdeaController.getLinkToIdea,
  likeIdea: IdeaController.likeIdea
};

/**
 * The idea module handling all client requests concerning idea data.
 */
module IdeaController {

  /**
   * Add a new idea to the database and return the link to that idea.
   *
   * @param req
   * @param res
   */
  export function addIdea(req, res) {

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
  }

  /**
   * Get a list of all ideas. Could include a query parameter.
   *
   * @param req
   * @param res
   */
  export function getIdeas(req, res) {

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
}