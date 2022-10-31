class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestination) {
    const element = document.getElementById(elementId);
    const destination = document.querySelector(newDestination);
    destination.append(element);
  }
}

class GrandMaster {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  dettach() {
    if (this.element) {
      this.element.remove();
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? "afterbegin" : "beforeend",
      this.element
    );
  }
}
class InfoWindow extends GrandMaster {
  constructor(closeNotifier) {
    super();
    this.closeNotifierHandler = closeNotifier;
    this.render();
  }

  closeInfoWindow = () => {
    this.dettach();
    this.closeNotifierHandler();
  };

  render() {
    const newInfoElement = document.createElement("div");
    newInfoElement.className = "card";
    newInfoElement.textContent = "DUMMY!";
    newInfoElement.addEventListener("click", this.closeInfoWindow);
    this.element = newInfoElement;
  }
}

class ProjectItem {
  hasActiveInfoBox = false;

  constructor(id, updateProjectListsFunction, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.moreInfoButton();
    this.switchButton(type);
  }

  showMoreInfoHandler() {
    if (this.hasActiveInfoBox) {
      return;
    }
    const infoWindow = new InfoWindow(() => {
      this.hasActiveInfoBox = false;
    });
    infoWindow.attach();
    this.hasActiveInfoBox = true;
  }

  moreInfoButton() {
    const itemElement = document.getElementById(this.id);
    const moreInfoBtn = itemElement.querySelector("button:first-of-type");
    moreInfoBtn.addEventListener("click", this.showMoreInfoHandler);
  }

  switchButton(type) {
    const itemElement = document.getElementById(this.id);
    let switchBtn = itemElement.querySelector("button:last-of-type");
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === "active" ? "Finish" : "Activate";
    switchBtn.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }
  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.switchButton(type);
  }
}

class Lists {
  projects = [];

  constructor(type) {
    this.type = type;
    const projectItems = document.querySelectorAll(`#${type}-projects li`);
    for (const projectItem of projectItems) {
      this.projects.push(
        new ProjectItem(
          projectItem.id,
          this.switchProject.bind(this),
          this.type
        )
      );
    }
    console.log(this.projects);
  }

  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    this.switchHandler(this.projects.find((proj) => proj.id === projectId));
    this.projects = this.projects.filter((proj) => proj.id !== projectId);
  }
}

class App {
  static init() {
    const activeList = new Lists("active");
    const finishedList = new Lists("finished");
    activeList.setSwitchHandlerFunction(
      finishedList.addProject.bind(finishedList)
    );
    finishedList.setSwitchHandlerFunction(
      activeList.addProject.bind(activeList)
    );
  }
}

App.init();
