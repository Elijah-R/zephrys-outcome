export default () => {
  function classesAddWithDelay(element, classInstant, classDelay, delay) {
    element.classList.add(classInstant);
    setTimeout(() => {
      element.classList.add(classDelay);
    }, delay);
  }

  function classesRemoveWithDelay(element, classInstant, classDelay, delay) {
    element.classList.remove(classInstant);
    setTimeout(() => {
      element.classList.remove(classDelay);
    }, delay);
  }

  window.utils = {
    classesAddWithDelay,
    classesRemoveWithDelay,
  };
};
