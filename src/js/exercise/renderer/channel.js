(interactiveEbook => {
  'use strict';

  const channelsEndpoint = 'http://localhost:8000/channel';
  const mode = 'cors';

  interactiveEbook.renderers.channel = () => {
    let channelId;

    const install = existingChannelId => {
      if (existingChannelId) {
        channelId = existingChannelId;

        return Promise.resolve(channelId);
      }

      return fetch(channelsEndpoint, {
        method: 'post',
        mode,
      })
        .then(response => response.json())
        .then(({id}) => {
          console.log(`Channel created ${ id }`);
          channelId = id;

          return id;
        });
    };

    const render = snippet => {
      if (!channelId) {
        return;
      }

      fetch(`${ channelsEndpoint }/${ channelId }`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        mode,
        body: JSON.stringify(snippet),
      }).then(() => {
        console.log(`Rendered snippet to channel ${ channelId }`);
      })
    };

    const teardown = () => {
      if (!channelId) {
        return;
      }
      fetch(`${ channelsEndpoint }/${ channelId }`, {
        method: 'delete',
        mode,
      }).then(() => {
        console.log(`Channel ${ channelId } closed`);
      })
    };

    return {install, render, teardown};
  };

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  global.interactiveEbook.renderers = global.interactiveEbook.renderers || {};
  return global.interactiveEbook;
})(window));
