import Project from "../models/Project";
import Todo from "../models/Todo";
import StorageInterface from "../storage/StorageInterface";

export default class ProjectService {
  /**
   * @param {StorageInterface} storage- la interfaz de almacenamiento
   */

  constructor(storage) {
    this.storage = storage;
    this.projects = this.storage.load();
    if (this.projects.length === 0) {
      const defaultProject = new Project("p-1", "Mi primer proyecto");
      this.projects.push(defaultProject);
      this.storage.save(this.projects);
    }
  }

  createProject(name) {
    const newProject = new Project(`p-${Date.now()}`, name);
    this.projects.push(newProject);
    this.storage.save(this.projects);
    return newProject;
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);
    this.storage.save(this.projects);
  }

  editProject(projectId, newTitle) {
    const projectEdit = this.projects.find((p) => p.id === projectId);
    if (projectEdit) {
      projectEdit.name = newTitle;
      this.storage.save(this.projects);
      return projectEdit;
    }
    return null;
  }

  addTodoToProject(
    projectId,
    todoTitle,
    description,
    dueDate,
    priority,
    notesList
  ) {
    const project = this.projects.find((p) => p.id === projectId);

    if (project) {
      const newTodo = new Todo(
        `t-${Date.now()}`,
        todoTitle,
        description,
        dueDate,
        priority,
        notesList
      );
      project.addTodo(newTodo);
      this.storage.save(this.projects);
      return newTodo;
    }
    return null;
  }

  removeTodoFromProject(projectId, todoId) {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      project.removeTodo(todoId);
      this.storage.save(this.projects);
    }
  }

  getAllProjects() {
    return this.projects;
  }

  getProjectById(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }
}
