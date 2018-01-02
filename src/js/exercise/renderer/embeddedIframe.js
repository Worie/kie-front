import internalScript from '../lib/iframe/internal.js';
import getEmbeddedInternalScript from '../lib/iframe/getEmbeddedInternalScript.js';


(interactiveEbook => {
  'use strict';

  const {
    getIframeWindow,
    sendSnippet,
    injectScript,
    styleIframe,
  } = interactiveEbook.common;

  window.internalConfig = {
    chapterId: window.interactiveEbook.chapterId,
    modules: getEmbeddedInternalScript()
  };

  interactiveEbook.renderers.embeddedIframe = rendererContainer => {
    let iframe;

    const setupIframe = (iframeWindow) => {
      const iframeDoc = iframeWindow.document;
      injectScript(iframeDoc, `assets/js/iframe.js`);
      const scriptEl = iframeDoc.createElement('script');
      scriptEl.innerHTML = `window.internal = {config: ${JSON.stringify(internalConfig)},script: ${internalScript}};`;
      iframeDoc.body.appendChild(scriptEl);
      styleIframe(iframe, {
        parent: rendererContainer,
      });
    };

    const install = () => {
      iframe = document.createElement('iframe');
      rendererContainer.appendChild(iframe);
      const iframeWindow = getIframeWindow(iframe);

      // Chrome and Safari
      setupIframe(iframeWindow);

      // Firefox
      iframeWindow.addEventListener('load', () => {
        setupIframe(iframeWindow);
      });
    };

    const render = snippet => {
      if (!iframe) {
        return;
      }
      sendSnippet(snippet, getIframeWindow(iframe));
    };

    const teardown = () => {
      if (!iframe) {
        console.log('iframe teardown called, no iframe');
        return;
      }
      rendererContainer.removeChild(iframe);
    };

    return {install, render, teardown};
  };

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  global.interactiveEbook.renderers = global.interactiveEbook.renderers || {};
  return global.interactiveEbook;
})(window));
