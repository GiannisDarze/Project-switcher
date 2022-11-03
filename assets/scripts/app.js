import { Lists } from "./List.js";

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
