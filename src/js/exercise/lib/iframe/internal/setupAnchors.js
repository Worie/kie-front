export default moduleConfig => {
  const {
    document
  } = moduleConfig;

  function parentAnchor(element) {
    if (!element.matches) return false;
    if (element.matches('a')) return element;
    return element.parentNode && parentAnchor(element.parentNode);
  }


  const setupInternal = () => {
  const baseHref = document.querySelector('base[data-snippet-locked]').getAttribute('href');

    document.body.addEventListener('click', ev => {
      var el = parentAnchor(ev.target);

      if (el) {
        ev.preventDefault();

        if (el.href.indexOf(baseHref+"#") === 0) {
          location.hash = el.href.substr(baseHref.length + 1, el.href.length - (baseHref.length + 1));
        } else {
          window.open(el.href, '_blank');
        }
        // might come in handy if we have multiple html files
        // user could href to them theoretically

      }
    });
  };

  window.setupInternal = setupInternal;
  setupInternal();
};
