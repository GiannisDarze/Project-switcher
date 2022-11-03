import { GrandMaster } from "./Component.js";
export class InfoWindow extends GrandMaster {
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
