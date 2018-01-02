(interactiveEbook => {
  'use strict';

  const getRenderHtmlCssSnippet = document => snippet => {
    document.open();
    document.write('');
    document.close();

    const internalStyleEl = document.createElement('style');
    document.head.appendChild(internalStyleEl);
    internalStyleEl.innerHTML = 'body {margin: 0;}';
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    styleEl.innerHTML = snippet.code.css;
    document.body.innerHTML = snippet.code.html;
  };

  const getRenderPageSnippet = document => snippet => {
    document.open();
    document.write(snippet.code);
    document.close();
  };

  const parseSnippet = snippetString => {
    try {
      console.log(snippetString);
      return JSON.parse(snippetString);
    } catch (error) {
      console.log('not json:', snippetString);
      console.error(error);
    }
  };

  const getMessageReceiver = container => {
    const sandbox = interactiveEbook.common.getIframeWindow(container).document;
    const renderers = {
      page: getRenderPageSnippet(sandbox),
      htmlCss: getRenderHtmlCssSnippet(sandbox)
    };

    return event => {
      if (!event.data) {
        console.log('no data');

        return;
      }

      const snippet = parseSnippet(event.data);
      if (!snippet) {
        console.log('event.data', event.data);
      }

      if (snippet.type in renderers) {
        renderers[snippet.type](snippet);

        // ACK if possible.
        if (event.source) {
          event.source.postMessage('rendered', event.origin);
        }
      }
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

    interactiveEbook.common.styleIframe(container, {
      parent: document.body
    });

    const channelId = getChannelId();
    console.log('channel', channelId);
    const eventSource = channelId ?
      new EventSource(`http://localhost:8000/channel/${ channelId }`) :
      window;

    eventSource
      .addEventListener('message', getMessageReceiver(container), false);
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
