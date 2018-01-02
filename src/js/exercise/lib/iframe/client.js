import diffDOM from './diffDOM/diffDOM'
import _ from './lodash/lodash.custom.min.js'
import internal from './internal'


(interactiveEbook => {
  'use strict';

  // snippet files is array that contains whole files that were send here (with contents, markers etc) * should there be markers?
  // get rid of those soon
  let snippetFiles = [];
  let files = [];
  let lastRenderedHtml;

  let hasBeenRenderedBefore = false;

  let currentHTML = document.createElement('html');
  let currentDocument;

  // recon this one too
  let sandbox;

  let renderers;

  const constantElements = [];


  // html snippets need to be rendered first. If css/js files are rendered before html,
  // their presence will be lost (attempt to write to array that is still undefined)

  const getRenderHtmlSnippet = document => (file, incremental) => {
    window.internal.config.document = document;
    // split to separate funcitons
    let fileName = file.fileName;
    let toBeRendered = [];
    let linkedAssets = [];

    currentDocument = document;

    let tmp = [];
    tmp['js'] = [];
    tmp['css'] = [];

    // very hacky, but will do
//    document.querySelector('html').kodujeConstantAssets.forEach()

    let nextHTML = document.createElement('html');
    nextHTML.innerHTML = file.contents;



    // those two nodes are pretty much static. Could be moved somewhere
    const baseHTMLEl = document.createElement('base');
    // chapterId is passed from spawnedWindow.js and the other one
    baseHTMLEl.href = `${window.origin}/${window.internal.config.chapterId}/`;
    baseHTMLEl.setAttribute('data-snippet-locked', true);

    nextHTML.querySelector('head').appendChild(baseHTMLEl);

//    const internalScript = document.createElement('script');
//    // This is provided by spawnedWindow.js or embeddedIframe.js
//    internalScript.innerHTML = `(${})(${JSON.stringify(window.internal.config)});`;
//    nextHTML.querySelector('body').appendChild(internalScript);

    // add every style and script to array

    Array.from(nextHTML.querySelectorAll('link[href]')).forEach(node => {
      let href = node.getAttribute('href');
      tmp['css'].push(href);
      linkedAssets.push(href);
      node.parentNode.removeChild(node);
    });

    Array.from(nextHTML.querySelectorAll('script[src]')).forEach( node => {
      let src = node.getAttribute('src');
      tmp['js'].push(src);
      linkedAssets.push(src);
      node.parentNode.removeChild(node);
    });

    if (!files[fileName]) {
      files[fileName] = [];
      files[fileName]['js'] = tmp['js'];
      files[fileName]['css'] = tmp['css'];
    }

//
//
//    Object.keys(files[fileName]).forEach(type => {
//      files[fileName][type] = files[fileName][type].filter(el => {
//        console.log(el, tmp[type], tmp[type].includes(el));
//        return tmp[type].includes(el)
//      });
//    });



//    Object.keys(tmp).forEach(type => {
//      tmp[type].filter(el => files[fileName][type].includes(el));
//      toBeRendered = toBeRendered.concat(tmp[type]);
//    });

    lastRenderedHtml = file.fileName;
    if (!_.isEqual(tmp.js, files[fileName].js) || !_.isEqual(tmp.css, files[fileName].css)) {
      incremental = false;
      toBeRendered = linkedAssets;
      files[fileName] = tmp;
    }

    //reconsider this
    if (!incremental) {
      currentDocument.querySelector('html').innerHTML = nextHTML.innerHTML;
      window.internal.script(window.internal.config);
    } else {
      let dd = new diffDOM({
        preDiffApply: info => {
          let e = info.diff.e;


          if (e && e.attributes) {
            if(e.attributes.hasOwnProperty('data-snippet-asset') && linkedAssets.includes(e.attributes['data-snippet-asset'])
              || e.attributes.hasOwnProperty('data-snippet-locked')) {
                return true;
            }
          }
      }
      });

      let currentHtml = currentDocument.querySelector('html');

      let diff = dd.diff(currentHtml, nextHTML);
      try {
        dd.apply(currentHtml, diff);
      } catch (err) {}
    }
    return toBeRendered;
  };

  const getRenderCssSnippet = document => (file, reRender) => {
    if (files[lastRenderedHtml]['css'].includes(file.fileName)) {
      let newStyleEl = document.createElement('style');
      newStyleEl.innerHTML = file.contents;
      newStyleEl.setAttribute('data-snippet-asset', file.fileName);

      let oldStyleEl = currentDocument.querySelector(`[data-snippet-asset="${file.fileName}"]`);
      let head = currentDocument.querySelector('head');

      if (oldStyleEl)
        head.removeChild(oldStyleEl);
      head.appendChild(newStyleEl);
    }
  };

  const catchScriptError = (file) => {
    window.internal = window.internal || {};
    window.internal.lastErr = window.internal.lastErr || "null";
    const internalFn = (obj) => {
      window.internal = window.internal || {};
      try {
        eval(obj.codeInFunc());

        // dry 1
        if (window.internal.errTimeout) {
          clearTimeout (window.internal.errTimeout);
        }
        window.internal.errTimeout = setTimeout (() => {
          console.info(`%cFile ${obj.fileName} is valid`, "color: green;");
        }, 1500);
      } catch (err) {
        window.internal.lastErr = err;
        console.warn("Delaying error reporting...");

        // dry 1
        if (window.internal.errTimeout) {
          clearTimeout (window.internal.errTimeout);
        }
        window.internal.errTimeout = setTimeout (() => {
          console.error(window.internal.lastErr);
        }, 1500);
      }
    };

    // recheck with ` in src file
    return `(${internalFn})({fileName: "${file.fileName}", codeInFunc: function() {eval(\`${file.contents.replace(/\`/g,'\\`')}\`)}});`;
  };

  const getRenderJsSnippet = document => (file, reRender) => {
    if (files[lastRenderedHtml]['js'].includes(file.fileName)) {
      let newScriptEl = document.createElement('script');
      newScriptEl.innerHTML = catchScriptError(file);
      newScriptEl.setAttribute('data-snippet-asset', file.fileName);

      let oldScriptEl = currentDocument.querySelector(`[data-snippet-asset="${file.fileName}"]`);
      let body = currentDocument.querySelector('body');

      if (oldScriptEl)
        body.removeChild(oldScriptEl);

      body.appendChild(newScriptEl);
    }
  };

  const parseData = data => {
    try {
      return JSON.parse(data)
    } catch (error) {
//      console.log('not json:', data);
//      console.error(error);
    }
  };

  const renderData = data => {
      snippetFiles = data.snippet.files;
      let singleFileToRender = data.renderOnly;


      if (singleFileToRender && !/.js/.test(singleFileToRender)) {
        let file = snippetFiles.find(x => x.fileName === singleFileToRender);
        let toBeRendered = renderers[file.cmMode](file, true);

        if (toBeRendered) {
          snippetFiles = snippetFiles.filter(file => {
            return toBeRendered.includes(file.fileName)
          });
        } else {
          return;
        }
      }

      // make sure html files are always send first
      // move it
      snippetFiles.sort((a,b) => {
        var regex = /html/g;
        var x = regex.test(a.fileName);
        var y = regex.test(b.fileName);

        if (x)
          return -1
        if (y)
          return 1;
        return 0;
      });


      snippetFiles.forEach((file) => {

        if (file.cmMode in renderers) {
          // TODO change it to something else than cmMode
          renderers[file.cmMode](file);
          // ACK if possible.
//          if (event.source) {
//            event.source.postMessage('rendered', event.origin);
//          }
        }
      });

      if (!hasBeenRenderedBefore) {
        window.internal.script(window.internal.config);
        hasBeenRenderedBefore = true;
      }

  };

  const getMessageReceiver = container => {
    sandbox = interactiveEbook.common.getIframeWindow(container).document;
    renderers = {
      css: getRenderCssSnippet(sandbox),
      // todo: do not base on htmlmixed as it is a cm syntax highlight mode only. It may not be html file
      htmlmixed: getRenderHtmlSnippet(sandbox),
      javascript: getRenderJsSnippet(sandbox)
    };


    return event => {
      if (!event.data) {
//        console.log('no data');
        return;
      }

      const data = parseData(event.data);
      if (!data) {
//        console.log('event.data', event.data);
        return;
      }

      if (!data.snippet) {
        return;
      }

      renderData(data);
    };
  };

  const getChannelId = () => new Map(
    location
      .search
      .split(/[&\\?]/)
      .map(str => str.split('='))
      .filter(({length}) => length === 2)
  ).get('channel');

  const init = () => {
    const container = document.createElement('iframe');
    container.style.borderWidth = 0;
    document.body.appendChild(container);
    const internalStyleEl = document.createElement('style');
    document.head.appendChild(internalStyleEl);
    internalStyleEl.innerHTML = 'body {margin: 0px;}';

    interactiveEbook.common.styleIframe(container, {
      parent: document.body
    });

    const channelId = getChannelId();
    const eventSource = channelId ?
      new EventSource(`http://localhost:8000/channel/${ channelId }`) :
      window;

    // Chrome and Safari
    eventSource
      .addEventListener('message', getMessageReceiver(container), false);

    // Firefox
    eventSource
      .addEventListener('load', () => {
        eventSource
          .addEventListener('message', getMessageReceiver(container), false);
      });

    if (interactiveEbook.lastRenderedSnippet) {
      renderData({ snippet: interactiveEbook.lastRenderedSnippet });
    }
  };

  const isEmbedded = window !== window.top;

  try {
    init();

    if (isEmbedded) {
      window
        .parent
        .postMessage('clientInstalled', window.parent.location.origin);
    }

  } catch (error) {
    if (isEmbedded) {
      window
        .parent
        .postMessage(
          `clientInstallationFailed:${ error.message }`,
          window.parent.location.origin
        );
    }
  }

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  return global.interactiveEbook;
})(window));

