import expirationDate from "../utils/expirationDate";
import parseFormattedDate from "../utils/parseFormattedDate";
export default class UIRenderer {
  constructor() {
    this.projectListElement = document.getElementById("project-list");
    this.todoListElement = document.getElementById("todo-list");
    this.currentProjectTitleElement = document.getElementById(
      "current-project-title"
    );

    //referencias para los detalles
    this.todoDetailsContainer = document.getElementById(
      "todo-details-container"
    );
    this.detailsTodoTitle = document.getElementById("details-todo-title");
    this.detailsTodoDescription = document.getElementById(
      "details-todo-description"
    );
    this.detailsTodoDueDate = document.getElementById("details-todo-dueDate");
    this.detailsTodoPriority = document.getElementById("details-todo-priority");
    this.detailsTodoNotes = document.getElementById("details-todo-notes");

    //referencia para el titulo para cuando edite un proyecto
    this.detailsTitleProject = document.getElementById("edit-title-project");

    //referencia para los campos, cuando edite una tarea
    this.editTitle = document.getElementById("edit-title");
    this.editDescription = document.getElementById("edit-description");
    this.editDueDate = document.getElementById("edit-dueDate");
    this.editPriority = document.getElementById("edit-priority");
    this.editNoteList = document.getElementById("edit-noteList");

    //mensaje de error
    this.message = document.getElementById("message");

    this.messageWarning = document.getElementById("messageWarning");
  }

  /**
   *
   * @param {Array<import("../models/Project").project>} projects - Array de proyectos.
   */

  renderProjects(projects) {
    if (!this.projectListElement) return;

    this.projectListElement.innerHTML = "";
    projects.forEach((project) => {
      const li = document.createElement("li");
      li.className = "project-item";
      li.dataset.projectId = project.id;
      li.innerHTML = `<span>${project.name}</span><div class="content-btn-project">
      <button class="delete-project-btn" data-project-id="${project.id}"><i class="fa-solid fa-xmark"></i></button>
      <button class="edit-project-btn" data-project-id="${project.id}"><i class="fa-solid fa-pen-to-square"></i></button></div>`;
      this.projectListElement.appendChild(li);
    });

    //Seleccionar automaticamente el primer proyecto si no hay uno activo
    if (
      projects.length > 0 &&
      !document.querySelector(".project-item.active")
    ) {
      this.projectListElement
        .querySelector(".project-item")
        .classList.add("active");
      this.renderTodos(projects[0]);
    } else if (projects.length === 0) {
      this.todoListElement.innerHTML = "";
      this.currentProjectTitleElement.textContent =
        "ningún proyecto seleccionado";
    }
  }

  /**
   *
   * @param {import("../models/Project").Project} project - el proyecto cuyas tareas se renderizarán
   */

  renderTodos(project) {
    if (!this.todoListElement || !project) return;

    this.todoListElement.innerHTML = "";
    this.currentProjectTitleElement.textContent = project.name; // Actualizar título del proyecto

    // Guardar el ID del proyecto en el elemento de la lista de tareas
    this.todoListElement.dataset.projectId = project.id;
    project.getTodos().forEach((todo) => {
      const today = new Date();
      const dateExpiration = todo.dueDate;

      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.dataset.todoId = todo.id;
      li.innerHTML = `
                <div class="content-text-li">
                  <div class="priority ${translatedProperty(todo.priority)}"></div>
                  <label class="custom-checkbox">
                    <input type="checkbox" class="todo-completed-checkbox" data-todo-id="${todo.id}" ${todo.completed ? "checked" : ""}>
                    <span class="checkmark"></span>
                  </label>
                  <div class="text-info " style="${todo.completed ? "text-decoration: line-through;" : ""}">
                    <span class="todo-item-title ${expirationDate(dateExpiration, today) ? "vencida" : ""}" data-todo-id="${todo.id}">${todo.title}</span>
                    <span class="todo-item-date ${expirationDate(dateExpiration, today) ? "vencida" : ""}" data-todo-id="${todo.id}">${todo.dueDate}</span>
                  </div>
                </div>
                <div class="content-btn">
                  <button class="show-details-btn" data-todo-id="${todo.id}"><i class="fa-solid fa-file-circle-plus"></i></button>
                  <button class="delete-todo-btn" data-todo-id="${todo.id}"><i class="fa-solid fa-xmark"></i></button>
                </div>
                `;
      this.todoListElement.appendChild(li);
    });
    // Ocultar el contenedor de detalles cuando se renderizan nuevas tareas
    this.hideTodoDetails();
  }

  /**
   * Muestra los detalles de una tarea específica.
   * @param {import('../models/Todo').Todo} todo - El objeto Todo a mostrar.
   */

  showTodoDetails(todo) {
    if (!this.todoDetailsContainer || !todo) return;

    this.detailsTodoTitle.textContent = `${todo.title}`;
    this.detailsTodoDescription.textContent = todo.description || "N/A";
    // Formatear la fecha si es necesario (asumiendo que dueDate es una cadena)
    this.detailsTodoDueDate.textContent = todo.dueDate ? todo.dueDate : "N/A";
    this.detailsTodoPriority.textContent = translatedProperty(todo.priority);
    this.detailsTodoPriority.className = translatedProperty(todo.priority);
    this.detailsTodoNotes.textContent =
      todo.notesList && todo.notesList.length > 0
        ? todo.notesList.join(", ")
        : "Ninguna";

    this.todoDetailsContainer.style.display = "block"; // Mostrar el contenedor
  }

  hideTodoDetails() {
    if (this.todoDetailsContainer) {
      this.todoDetailsContainer.style.display = "none"; // Ocultar el contenedor
    }
  }

  displayProjectTitle(project, projectId) {
    const projectFound = project.find((p) => p.id === projectId);

    this.detailsTitleProject.value = projectFound.name;
  }

  //muestra los datos en el modal de editar tarea
  editTaskData(projects, projectId, todoId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const todo = project.getTodos().find((t) => t.id === todoId);
      if (todo) {
        this.editTitle.value = todo.title;
        this.editDescription.value = todo.description;
        this.editDueDate.value = parseFormattedDate(todo.dueDate);
        this.editPriority.value = todo.priority;
        this.editNoteList.value = todo.notesList;
      }
    }
  }

  //muestra mensaje de eliminación
  removalMessage(btn) {
    this.message.textContent =
      btn.className === "delete-project-btn"
        ? "¿Estás seguro de que quieres eliminar este proyecto y todas sus tareas?"
        : "¿Estás seguro de que quieres eliminar esta tarea?";
  }

  selectedTodoMessage(btn) {
    this.messageWarning.textContent =
      btn.id === "add-todo-btn"
        ? "Por favor, seleccionar un proyecto primero"
        : "no es igual";
  }
}

function translatedProperty(priority) {
  switch (priority) {
    case "low":
      return "Bajo";

    case "medium":
      return "Medio";

    case "high":
      return "Alto";
    default:
      return "N/A";
  }
}
