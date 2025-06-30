export default class StorageInterface {
  //  Array de proyectos a guardar.
  /**
   * @param {Array<import('../models/Project').Project>} data
   */

  save(data) {
    throw new Error("se debe implementar el metodo save()");
  }

  load() {
    throw new Error("se debe implementar el metodo laod()");
  }
}
