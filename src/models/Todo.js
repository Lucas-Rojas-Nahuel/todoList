export default class Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    priority,
    notesList,
    completed = false
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notesList = notesList;
    this.completed = completed;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updateDetails({
    newTitle,
    newDescription,
    newDueDate,
    newPriority,
    newNotesList,
  }) {
    this.title = newTitle;
    this.description = newDescription;
    this.dueDate = newDueDate;
    this.priority = newPriority;
    this.notesList = newNotesList;
  }
}
