import StorageInterface from "./StorageInterface";
import Project from "../models/Project";

export default class LocalStorageAdapter extends StorageInterface {
  constructor() {
    super();
    this.KEY = "todoAppProjects";
  }
  /**
   *
   * @param {Array<Project>} data - Array de proyectos a guardar
   */

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      console.error("error al guardar en localStorage");
    }
  }

  /**
   *
   * @returns {Array<Project>} - array de proyectos cargados
   */

  load() {
    try {
      const data = localStorage.getItem(this.KEY);

      if (data) {
        const rawProjects = JSON.parse(data);

        return rawProjects.map((projectData) => {
          return new Project(
            projectData.id,
            projectData.name,
            projectData.todos
          );
        });
      }
    } catch (e) {
      console.error("error de carga del localStorage: ");
    }
    return [];
  }
}
