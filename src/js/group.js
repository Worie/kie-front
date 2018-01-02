export default ({
  className
}) => {

  const rootEl = document.createElement('div');
  rootEl.classList.add(className);


  const add = entity => {
    rootEl.appendChild(entity.getRootEl());
  };

  const remove = entity => {
    rootEl.removeChild(entity.getRootEl());
  };

  const getRootEl = () => {
    return rootEl;
  };

  return {
    getRootEl,
    add,
    remove
  };
};
