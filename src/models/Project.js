import Todo from "./Todo";

export default class Project {
  constructor(id, name, todos = []) {
    this.id = id;
    this.name = name;
    this.todos = todos.map(todoData => new Todo(
        todoData.id,
        todoData.title,
        todoData.description,
        todoData.dueDate,
        todoData.priority,
        todoData.notesList,
        todoData.completed
    ));
  }

  addTodo(todo) {
    if(!todo){
        throw new Error("Solo se puede agregar instancias de Todo a un proyecto ")
    }
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
  }

  getTodos() {
    return this.todos;
  }
}

