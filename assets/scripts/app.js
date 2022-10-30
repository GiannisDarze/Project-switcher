class InfoWindow {}

class ProjectItem {
  constructor(id) {
    this.id = id;
    this.moreInfoButton();
    this.switchButton();
  }

  moreInfoButton() {}

  switchButton() {
    const itemElement = document.getElementById(this.id);
    const switchBtn = itemElement.querySelector("button: last-of-type");
    switchBtn.addEventListener("click");
  }
}

class Lists {
  projects = [];

  constructor(type) {
    const projectItems = document.querySelectorAll(`#${type}-projects li`);
    for (const projectItem of projectItems) {
      this.projects.push(new ProjectItem(projectItem.id));
    }
    console.log(this.projects);
  }

  addProject() {}

  switchProject(projectId) {
    this.projects = this.projects.filter((proj) => proj.id !== projectId);
  }
}

class App {
  static init() {
    const activeList = new Lists("active");
    const finishedList = new Lists("finished");
  }
}

App.init();
