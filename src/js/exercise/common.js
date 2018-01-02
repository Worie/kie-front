(interactiveEbook => {
  'use strict';

  const injectScript = (document, relativePath) => {
    const clientScript = document.createElement('script');
    clientScript.setAttribute('type', 'text/javascript');
    clientScript.setAttribute('src', relativePath);
    document.body.appendChild(clientScript);
  };

  const styleIframe = (iframe, {parent}) => {
    iframe.style.borderWidth = 0;

    const {
      width,
      height,
      paddingLeft
    } = getComputedStyle(parent);
    // reconsider here
    // iframe.style.height = height;
    // iframe.style.width = `${ parseInt(width) - parseInt(paddingLeft) }px`;
  };

  const sendSnippet = (snippet, window) => {
    window.postMessage(JSON.stringify(snippet), location.origin);
  };

  /**
   * @todo dedupe client and main
   * @see http://stackoverflow.com/a/11797741/413256
   * @param iframe_object
   * @returns {*}
   */
  function getIframeWindow(iframe_object) {
    var doc;

    if (iframe_object.contentWindow) {
      return iframe_object.contentWindow;
    }

    if (iframe_object.window) {
      return iframe_object.window;
    }

    if (!doc && iframe_object.contentDocument) {
      doc = iframe_object.contentDocument;
    }

    if (!doc && iframe_object.document) {
      doc = iframe_object.document;
    }

    if (doc && doc.defaultView) {
      return doc.defaultView;
    }

    if (doc && doc.parentWindow) {
      return doc.parentWindow;
    }

    return undefined;
  }

  interactiveEbook.common.getIframeWindow = getIframeWindow;
  interactiveEbook.common.injectScript = injectScript;
  interactiveEbook.common.styleIframe = styleIframe;
  interactiveEbook.common.sendSnippet = sendSnippet;

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  global.interactiveEbook.common = global.interactiveEbook.common || {};
  return global.interactiveEbook;
})(window));
