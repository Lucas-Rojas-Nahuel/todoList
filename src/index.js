import Project from "./models/Project";
import Todo from "./models/Todo";
import ProjectService from "./services/ProjectService";
import { TodoService } from "./services/TodoService";
import "./styles/main.css";

import LocalStorageAdapter from "./storage/LocalStorageAdapter";
import { UIEvents } from "./ui/UIEvents";
import UIRenderer from "./ui/UIRenderer";
 

//crear una instancia del adaptador de almacenamiento (detalle de bajo nivel)
const storageAdapter = new LocalStorageAdapter();
// Inyectar el adaptador (abstracción StorageInterface) en los servicios de negocio (alto nivel)
//esto demuestra la inversion de dependencias (DIP)
const projectService = new ProjectService(storageAdapter);
const todoService = new TodoService(projectService); // Si TodoService también necesita guardar/cargar

//crear instancias de UI
const uiRenderer = new UIRenderer();
const UIEventss = new UIEvents(projectService, todoService, uiRenderer); //UIEvents necesitará interactuar con los servicios y el renderizador

//inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  //Cargar los proyectos al inicio
  const projects = projectService.getAllProjects();
  uiRenderer.renderProjects(projects);

  //bindear los eventos de la ui
  UIEventss.bindAllEvents();
});

 
window.projectService = projectService;
window.TodoService = TodoService;
window.uiRenderer = uiRenderer;
