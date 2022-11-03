import { DOMHelper } from "./DomHelper.js";
import { InfoWindow } from "./InfoWindow.js";

export class ProjectItem {
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
