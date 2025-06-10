export default class UIRenderer {
  renderProjects(projects) {
    projects.forEach((project) => {
      console.log(project.name);
    });
  }

  renderTodos(projects) {
    projects.getTodos().forEach((todo) => {
      console.log(todo.title);
    });
  }
}
