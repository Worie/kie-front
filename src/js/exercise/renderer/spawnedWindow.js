import internalScript from '../lib/iframe/internal.js';
import getEmbeddedInternalScript from '../lib/iframe/getEmbeddedInternalScript.js';


(interactiveEbook => {
  'use strict';

  const {
    sendSnippet,
  } = interactiveEbook.common;

  let spawnedWindow;

  interactiveEbook.renderers.spawnedWindow = () => {
    window.internalConfig = {
      chapterId: window.interactiveEbook.chapterId,
      modules: getEmbeddedInternalScript()
    };

    const install = (trigger) => {
      let server = location.href;

      const internalScriptEl = `<script id="internalScript">window.internal = {config: ${JSON.stringify(internalConfig)},script: ${internalScript}};var self = document.querySelector('#internalScript'); self.parentNode.removeChild(self);</script>`;

      let passLastSnippet = "";

      if (window.interactiveEbook.lastRenderedSnippet) {
        // scariest part of code ever EVER
        // basically escaping script tags, stringifying, then un-escaping script tags and parsing.
        // please do something with it when there'll be time
        passLastSnippet = `<script id="removableScriptEl">window.interactiveEbook = {}; window.interactiveEbook.lastRenderedSnippet = JSON.parse(\`${JSON.stringify(window.interactiveEbook.lastRenderedSnippet).replace(/<\/script>/g, "<\\/script>").replace(/\\"/g, '\\\\"')}\`.replace(/<\\\/script>/g,"<\\/script>").replace(/\\n/g, "\\\n"));var self = document.querySelector('#removableScriptEl'); self.parentNode.removeChild(self);</script>`;
      }

       const blob = new Blob([`<html><head><meta charset="utf-8"><style> body { background-color: #E5E5E5;
  background-image: url('${server}assets/images/icons/spawn-icon--active.svg');
  background-position: center;
  background-repeat: no-repeat;height: 100vh;width:100vw;}</style><title>Podgląd na żywo</title></head><body>${internalScriptEl}${passLastSnippet}<script src="${server}assets/js/iframe.js"></script></html>`], {type: 'text/html'});
      var url = URL.createObjectURL(blob);

      spawnedWindow = window
        .open(url, "Podgląd na zywo", "height=500,width=500,menubar=no,toolbar=no,dependent=yes");

      // Deactivates open in new window button once the window is closed
      spawnedWindow.addEventListener('beforeunload', () => {
        trigger.switchState(false);
      });

    };

    const render = snippet => {
      if (!spawnedWindow) {
        return;
      }
      sendSnippet(snippet, spawnedWindow);
    };

    const teardown = () => {
      if (!spawnedWindow) {
        return;
      }
      spawnedWindow.close();
    };

    return {install, render, teardown};
  };

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  global.interactiveEbook.renderers = global.interactiveEbook.renderers || {};
  return global.interactiveEbook;
})(window));
