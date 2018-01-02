export default ({
  classNames,
  textContent,
  turnOn,
  turnOff,
  defaultState,
  title,
  disabled
}) => {

  let buttonState = defaultState;
  let self;

  const rootEl = document.createElement('button');

  rootEl.setAttribute('title', title);

  if (defaultState)
    rootEl.classList.add('active');

  if (disabled)
    disable();

  classNames.split(' ').forEach(className => {
    rootEl.classList.add(className);
  });

  const onClick = () => {
    if (disabled) {
      return;
    }
    switchState(!buttonState);
  };

  const switchState = state => {
    if (state) {
      rootEl.classList.add('active');
      turnOn(self);
    } else {
      rootEl.classList.remove('active');
      turnOff(self);
    }
    buttonState = !buttonState;
  };

  rootEl.addEventListener('click', onClick);

  const getRootEl = () => {
    return rootEl;
  }

  const getState = () => {
    return buttonState;
  };

  const disable = () => {
    rootEl.setAttribute('disabled', 'disabled');
    disabled = true;
  };

  const enable = () => {
    rootEl.setAttribute('disabled', false);
    disabled = false;
  };

  const setAttribute = (name, value) => {
    rootEl.setAttribute(name, value);
  };

  self = {
    switchState,
    getRootEl,
    getState,
    disable,
    enable,
    setAttribute
  };

  return self;
};
