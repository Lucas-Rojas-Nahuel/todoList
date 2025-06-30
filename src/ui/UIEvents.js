import dateUtils from "../utils/dateUtils";

export class UIEvents {
  constructor(projectService, todoService, uiRenderer) {
    this.projectService = projectService;
    this.todoService = todoService;
    this.uiRenderer = uiRenderer;
    this.sidebar = document.getElementById("sidebar"); //obtener la barra lateral
    this.toggleSidebarBtn = document.getElementById("toggle-sidebar-btn"); // Obtener el botón

    this.todoListElement = document.getElementById("todo-list");
    this.closeDetailsBtn = document.getElementById("close-details-btn"); // Nueva referencia

    // variable para guardar el ID de la tarea que se va a editar
    this.currentTodoId = null;
    // variable para guardar el ID del proyecto que se va a editar
    this.currentProjectId = null;
  }

  bindAllEvents() {
    this.bindProjectEvents();
    this.bindTodoEvents();
    this.bindTodoDetailsEvents();
    this.bindSidebarToggleEvents(); //Nuevo método para el botón de la sidebar
    this.bindShowHideTodoDetailsEvents(); // NUEVO MÉTODO
  }

  bindProjectEvents() {
    //evento para crear un nuevo proyecto
    const addProjectButton = document.getElementById("add-project-btn");
    if (addProjectButton) {
      addProjectButton.addEventListener("click", () => {
        //modal para crear un proyecto
        const createProjectModal = document.getElementById("createProject");
        //btn del modal para cerrar
        const btnCloseModalProject = document.getElementById(
          "close-modal-project"
        );

        //abrimos y cerramos modal
        createProjectModal.showModal();
        document.body.style.overflow = "hidden";
        btnCloseModalProject.addEventListener("click", (e) => {
          e.preventDefault();
          document.body.style.overflow = "";
          createProjectModal.close();
        });

        const formProject = document.getElementById("form-project");

        formProject.addEventListener("submit", (e) => {
          e.preventDefault();

          const data = new FormData(formProject);
          const nameProject = data.get("title-project");

          if (nameProject.trim()) {
            this.projectService.createProject(nameProject);
            this.uiRenderer.renderProjects(
              this.projectService.getAllProjects()
            );

            createProjectModal.close();
            formProject.reset();
          }
        });
      });
    }

    //eventos para eliminar proyectos
    let projectId = null;
    const cancelDelete = document.getElementById("no-delete");
    const deleteModal = document.getElementById("delete-modal");
    const deleteConfirm = document.getElementById("yes-delete");

    document.addEventListener("click", (event) => {
      const deleteBtn = event.target.closest(".delete-project-btn");

      if (deleteBtn) {
        this.uiRenderer.removalMessage(deleteBtn);
        projectId = deleteBtn.dataset.projectId;

        deleteModal.showModal();
      }
    });

    deleteConfirm.addEventListener("click", (e) => {
      e.preventDefault();

      this.projectService.deleteProject(projectId);
      this.uiRenderer.renderProjects(this.projectService.getAllProjects());
      deleteModal.close();
    });
    cancelDelete.addEventListener("click", (e) => {
      e.preventDefault();
      deleteModal.close();
    });

    //evento para editar un proyecto
    const editModal = document.getElementById("editProject");
    const formEditProject = document.getElementById("form-edit-project");
    const closeBtnModalEdit = document.getElementById(
      "close-modal-edit-project"
    );

    document.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".edit-project-btn");
      if (editBtn) {
        this.currentProjectId = editBtn.dataset.projectId;
        this.uiRenderer.displayProjectTitle(
          this.projectService.getAllProjects(),
          this.currentProjectId
        );
        editModal.showModal();
      }
    });

    closeBtnModalEdit.addEventListener("click", (e) => {
      e.preventDefault();
      editModal.close();
    });

    formEditProject.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(formEditProject);
      const newTitleProject = data.get("edit-title-project");
      editModal.close();
      this.projectService.editProject(this.currentProjectId, newTitleProject);
      this.uiRenderer.renderProjects(this.projectService.getAllProjects());
    });

    //evento para seleccionar un proyecto y mostrar sus tareas
    document.addEventListener("click", (e) => {
      const projectItemElement = e.target.closest(".project-item");
      if (projectItemElement) {
        const activeProjectItem = document.querySelector(
          ".project-item.active"
        );
        if (activeProjectItem) {
          activeProjectItem.classList.remove("active");
        }
        projectItemElement.classList.add("active");
        const projectId = projectItemElement.dataset.projectId;
        const project = this.projectService.getProjectById(projectId);

        if (project) {
          this.uiRenderer.renderTodos(project);
        }
      }
    });
  }

  bindTodoEvents() {
    //evento para añadir una tarea a un proyecto seleccionado
    const addTodoButton = document.getElementById("add-todo-btn");
    const warningAlert = document.getElementById("warning-modal");
    const closeWarningAlert = document.getElementById("message-confirm");
    if (addTodoButton) {
      addTodoButton.addEventListener("click", () => {
        const activeProjectId = document.querySelector(".project-item.active")
          ?.dataset.projectId; //asumiendo un proyecto activo
        if (!activeProjectId) {
          this.uiRenderer.selectedTodoMessage(addTodoButton);
          warningAlert.showModal();
          return;
        }

        // modal para agregar una tarea
        const addTask = document.getElementById("createTask");

        //abro el modal
        addTask.showModal();
        document.body.style.overflow = "hidden";

        //boton de cerrar del modal
        const closeModal = document.getElementById("closeModal");
        //cerramos modal
        closeModal.addEventListener("click", (e) => {
          e.preventDefault();
          document.body.style.overflow = "";
          addTask.close();
        });

        if (addTask.open) {
          const form = document.getElementById("form-modal");
          const spanTitle = document.querySelector(".error-title");
          const spanDate = document.querySelector(".error-date");

          //validacion de las tareas
          function isValidTask(tarea) {
            !tarea.title.trim()
              ? (spanTitle.textContent = "Titulo requerido")
              : (spanTitle.textContent = "");

            !tarea.dueDate
              ? (spanDate.textContent = "Fecha de Vencimiento requerida")
              : (spanDate.textContent = "");
            return tarea.title.trim() && tarea.dueDate;
          }

          form.addEventListener("submit", (e) => {
            e.preventDefault();

            //obtenemos datos del formulario
            const datos = new FormData(form);

            //lo combertimos en formato JSON
            const tarea = Object.fromEntries(datos.entries());

            //separamos las notas

            tarea.noteList =
              tarea.noteList.length !== 0
                ? tarea.noteList.split(",").map((n) => n.trim())
                : tarea.noteList;

            if (isValidTask(tarea)) {
              tarea.dueDate = dateUtils(tarea.dueDate);
              const newTodo = this.projectService.addTodoToProject(
                activeProjectId,
                tarea.title,
                tarea.description,
                tarea.dueDate,
                tarea.priority,
                tarea.noteList
              );

              if (newTodo) {
                const activeProject =
                  this.projectService.getProjectById(activeProjectId);
                this.uiRenderer.renderTodos(activeProject);
              }

              //cierra modal cuando termina de agregar una nueva tarea
              addTask.close();

              //reseteamos los inpust del formulario
              form.reset();
            }
          });
        }
      });
      closeWarningAlert.addEventListener("click", () => {
        warningAlert.close();
      });
    }

    //evento para marcar/desmarcar una tarea como completa
    document.addEventListener("change", (event) => {
      if (event.target.classList.contains("todo-completed-checkbox")) {
        const checkbox = event.target;

        const li = checkbox.closest("li");
        const todoItemTitle = li.querySelector(".text-info");

        if (checkbox.checked) {
          todoItemTitle.style.textDecoration = "line-through";
        } else {
          todoItemTitle.style.textDecoration = "none";
        }

        const projectId = this.todoListElement.dataset.projectId;

        const todoId = event.target.dataset.todoId;
        if (projectId && todoId) {
          this.todoService.toggleTodoCompletion(projectId, todoId);
        }
        //no necesita re-renderizar todo, solo actualizar el estado visual del checkbox
      }
    });

    // Evento para eliminar una tarea
    const deleteTackModal = document.getElementById("delete-modal");
    const closeModalTackDelete = document.getElementById("no-delete");
    const confirmDeleteTack = document.getElementById("yes-delete");

    let todoId = null;
    const projectId = this.todoListElement.dataset.projectId; // <--- OBTENEMOS EL ID DEL PROYECTO DEL UL#TODO-LIST

    document.addEventListener("click", (event) => {
      const deleteTodoBtn = event.target.closest(".delete-todo-btn");
      if (deleteTodoBtn) {
        this.uiRenderer.removalMessage(deleteTodoBtn);
        // *** CORRECCIÓN AQUÍ ***
        todoId = deleteTodoBtn.dataset.todoId;
        deleteTackModal.showModal();
      }
    });

    closeModalTackDelete.addEventListener("click", () => {
      deleteTackModal.close();
    });

    confirmDeleteTack.addEventListener("click", (e) => {
      e.preventDefault();
      if (projectId && todoId) {
        this.projectService.removeTodoFromProject(projectId, todoId);
        const activeProject = this.projectService.getProjectById(projectId);
        this.uiRenderer.renderTodos(activeProject);
        deleteTackModal.close();
      }
    });
  }

  bindTodoDetailsEvents() {
    //evento para abrir/editar detalles de una tarea

    const editTackModal = document.getElementById("editTask");
    const btnCloseEditTackModal = document.getElementById("closeEditModal");
    const formEditTackModal = document.getElementById("form-edit-tack");

    btnCloseEditTackModal.addEventListener("click", (e) => {
      e.preventDefault();
      editTackModal.close();
      formEditTackModal.reset();
    });

    document.addEventListener("click", (event) => {
      const openDetailsModalBtn = event.target.closest(".open-edit-modal");
      if (openDetailsModalBtn) {
        const projectId = this.todoListElement.dataset.projectId;
        const todoId = this.currentTodoId;
        this.uiRenderer.editTaskData(
          this.projectService.getAllProjects(),
          projectId,
          todoId
        );
        editTackModal.showModal();
      }
    });

    //validacion de las tareas
    const spanTitle = document.querySelector(".error-title");
    const spanDate = document.querySelector(".error-date");
    function isValidTask(tarea) {
      !tarea.title.trim()
        ? (spanTitle.textContent = "Titulo requerido")
        : (spanTitle.textContent = "");

      !tarea.dueDate
        ? (spanDate.textContent = "Fecha de Vencimiento requerida")
        : (spanDate.textContent = "");
      return tarea.title.trim() && tarea.dueDate;
    }

    formEditTackModal.addEventListener("submit", (e) => {
      e.preventDefault();
      const projectId = this.todoListElement.dataset.projectId;
      const todoId = this.currentTodoId;

      if (projectId && todoId) {
        const project = this.projectService.getProjectById(projectId);

        if (project) {
          const todo = project.getTodos().find((t) => t.id === todoId);

          if (todo) {
            const data = new FormData(formEditTackModal);
            const tareaActualizada = {
              title: data.get("edit-title"),
              description: data.get("edit-description"),
              dueDate: dateUtils(data.get("edit-dueDate")),
              priority: data.get("edit-priority"),
              notesList: data
                .get("edit-noteList")
                ?.split(",")
                .map((n) => n.trim()),
            };

            if (isValidTask(tareaActualizada)) {
              // Asumiendo que updateTodo puede manejar solo el título
              this.todoService.updateTodo(projectId, todoId, tareaActualizada);
              editTackModal.close();
              this.uiRenderer.renderTodos(project); // Re-renderiza para mostrar el cambio
            }
          }
        }
      }
    });
  }

  // NUEVO MÉTODO PARA MOSTRAR/OCULTAR DETALLES CON BOTONES
  bindShowHideTodoDetailsEvents() {
    // Evento para mostrar los detalles de la tarea al hacer clic en el botón "Detalles"
    document.addEventListener("click", (event) => {
      const showTodoDetailsBtn = event.target.closest(".show-details-btn");
      if (showTodoDetailsBtn) {
        const projectId = this.todoListElement.dataset.projectId;
        const todoId = showTodoDetailsBtn.dataset.todoId;
        this.currentTodoId = todoId;

        if (projectId && todoId) {
          const project = this.projectService.getProjectById(projectId);
          if (project) {
            const todo = project.getTodos().find((t) => t.id === todoId);
            if (todo) {
              this.uiRenderer.showTodoDetails(todo); // Llama a la función de UIRenderer
            }
          }
        }
      }
    });

    // Evento para cerrar el contenedor de detalles
    if (this.closeDetailsBtn) {
      this.closeDetailsBtn.addEventListener("click", () => {
        this.uiRenderer.hideTodoDetails(); // Llama a la función de UIRenderer
      });
    }
  }

  bindSidebarToggleEvents() {
    if (this.toggleSidebarBtn && this.sidebar) {
      this.toggleSidebarBtn.addEventListener("click", () => {
        this.sidebar.classList.toggle("open"); //añade o quita la clase "open"
      });

      //cerrar sidebar si se hace clic fuera de ella (solo movil)
      document.addEventListener("click", (event) => {
        //Si la sidebar está abierta y el click no es dentro de la sidebar ni el botón
        if (
          this.sidebar.classList.contains("open") &&
          !this.sidebar.contains(event.target) &&
          !this.toggleSidebarBtn.contains(event.target)
        ) {
          this.sidebar.classList.remove("open");
        }
      });
    }
  }
}
