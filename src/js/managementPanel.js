import group from './group.js';

export default ({
  parentEl
}) => {
  const groupMap = new Map();

  const rootEl = document.createElement('nav');
  rootEl.classList.add('management-panel');

  // Make sure its a button
  const add = ({
    entity,
    groupName
  }) => {
    createGroup(groupName).add(entity);
  };

  const remove = ({
    entity,
    groupName
  }) => {
    createGroup(groupName).remove(entity);
  };

  const createGroup = name => {
    if (groupMap.has(name)) {
      return groupMap.get(name);
    }

    const theGroup = group({
      className: 'management-panel-group'
    });

    groupMap.set(name, theGroup);

    rootEl.appendChild(theGroup.getRootEl());

    return theGroup;
  }

  const removeGroup = name => {
    if (!groupMap.has(name)) {
      return false;
    }
    rootEl.removeChild(groupMap.get(name));
    groupMap.delete(name);
  };

  const getRootEl = () => {
    return rootEl;
  };


  parentEl.appendChild(rootEl);

  return {
    add,
    remove,
    getRootEl
  };
};
