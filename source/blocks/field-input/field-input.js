export default () => {
  const inputs = document.querySelectorAll('.js-form-input');

  if (inputs.length === 0) return;

  function onInputFocusIn(evt) {
    evt.target.parentElement.classList.add('form-input--filled');
  }

  function onInputFocusOut(evt) {
    if (evt.target.value === '') {
      evt.target.parentElement.classList.remove('form-input--filled');
    }
  }

  function onInput(evt) {
    if (evt.target.value !== '') {
      evt.target.parentElement.classList.add('form-input--filled');
    }
  }

  inputs.forEach((input) => {
    input.addEventListener('focusin', onInputFocusIn);
    input.addEventListener('focusout', onInputFocusOut);
    input.addEventListener('input', onInput);
  });
};
