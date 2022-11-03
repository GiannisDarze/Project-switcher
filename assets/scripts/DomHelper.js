export class DOMHelper {
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
