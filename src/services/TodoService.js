import Todo from "../models/Todo";
  // depende de projectService para operaciones anidadas

export class TodoService {
  constructor(projectServiceInstance) {
    this.projectService = projectServiceInstance;
  }

  updateTodo(projectId, todoId, updates) {
    const project = this.projectService.getProjectById(projectId);
    if (project) {
      const todo = project.getTodos().find((t) => t.id === todoId);
      if (todo) {
        Object.assign(todo, updates);
        this.projectService.storage.save(this.projectService.getAllProjects());
        return todo;
      }
    }
    return null;
  }

  toggleTodoCompletion(projectId, todoId) {
    const project = this.projectService.getProjectById(projectId);
    if (project) {
      const todo = project.getTodos().find((t) => t.id === todoId);
      if (todo) {
        todo.toggleCompleted();
        this.projectService.storage.save(this.projectService.getAllProjects());
        return todo;
      }
    }
    return null;
  }
}
