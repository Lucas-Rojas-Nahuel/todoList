export default class Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    priority,
    noteslist = "",
    checklist = []
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.noteslist = noteslist;
    this.checklist = checklist;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updateDetails({
    id,
    title,
    description,
    dueDate,
    priority,
    noteslist,
    checklist,
  }) {
    this.title = title || this.title;
    this.description = description || this.description;
    this.dueDate = dueDate || this.dueDate;
    this.priority = priority || this.priority;
    this.noteslist = noteslist || this.noteslist;
    this.checklist = checklist || this.checklist;
  }
}
