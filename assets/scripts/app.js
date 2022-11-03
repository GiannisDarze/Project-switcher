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
    element.scrollIntoView({ behavior: "smooth" });
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
  constructor(closeNotifier, text, hostElementId) {
    super(hostElementId);
    this.closeNotifierHandler = closeNotifier;
    this.text = text;
    this.render();
  }

  closeInfoWindow = () => {
    this.dettach();
    this.closeNotifierHandler();
  };

  render() {
    const newInfoElement = document.createElement("div");
    newInfoElement.className = "card";
    const infoWindowTemplate = document.getElementById("info-window");
    const infoWindowBody = document.importNode(
      infoWindowTemplate.content,
      true
    );
    infoWindowBody.querySelector("p").textContent = this.text;
    newInfoElement.append(infoWindowBody);

    const hostElPosLeft = this.hostElement.offsetLeft;
    const hostElPosTop = this.hostElement.offsetTop;
    const hostElHeight = this.hostElement.clientHeight;
    const parentElementScroll = this.hostElement.parentElement.scrollTop;

    const x = hostElPosLeft + 20;
    const y = hostElPosTop + hostElHeight - parentElementScroll - 10;

    newInfoElement.style.position = "absolute";
    newInfoElement.style.left = x + "px";
    newInfoElement.style.top = y + "px";

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
    this.dragging();
  }

  showMoreInfoHandler() {
    if (this.hasActiveInfoBox) {
      return;
    }
    const projectElement = document.getElementById(this.id);
    const infoWindowText = projectElement.dataset.extraInfo;

    const infoWindow = new InfoWindow(
      () => {
        this.hasActiveInfoBox = false;
      },
      infoWindowText,
      this.id
    );
    infoWindow.attach();
    this.hasActiveInfoBox = true;
  }

  dragging() {
    const item = document.getElementById(this.id);
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", this.id);
      event.dataTransfer.effectAllowed = "move";
    });
    item.addEventListener("dragend", (event) => {});
  }

  moreInfoButton() {
    const itemElement = document.getElementById(this.id);
    const moreInfoBtn = itemElement.querySelector("button:first-of-type");
    moreInfoBtn.addEventListener("click", this.showMoreInfoHandler.bind(this));
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
    this.droppingArea();
  }

  droppingArea() {
    const list = document.querySelector(`#${this.type}-projects ul`);

    list.addEventListener("dragenter", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
      }
      list.parentElement.classList.add("droppable");
    });

    list.addEventListener("dragover", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
      }
    });

    list.addEventListener("dragleave", (event) => {
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
        list.parentElement.classList.remove("droppable");
      }
    });

    list.addEventListener("drop", (event) => {
      const projectId = event.dataTransfer.getData("text/plain");
      if (this.projects.find((p) => p.id === projectId)) {
        return;
      }
      document
        .getElementById(projectId)
        .querySelector("button:last-of-type")
        .click();
      list.parentElement.classList.remove("droppable");
      event.preventDefault();
    });
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
