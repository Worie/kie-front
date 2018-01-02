(interactiveEbook => {
  'use strict';

  interactiveEbook.channelSupport = ({
    createChannelSelector,
    dropChannelSelector,
    clientLinkSelector,
    channelRenderer,
  }) => {
    const createChannel = document.querySelector(createChannelSelector);
    const dropChannel = document.querySelector(dropChannelSelector);
    const clientLink = document.querySelector(clientLinkSelector);

    const dropChannelInnerText = dropChannel.innerText;

    const getClientLink = channelId =>
      `${ location.href.replace('index.html', 'client.html') }?channel=${
        channelId }`;
    const toggleButton = () => {
      createChannel.style.display = 'none';
      dropChannel.style.display = 'inline';
    };
    const unToggleButton = () => {
      createChannel.style.display = 'inline';
      dropChannel.style.display = 'none';
    };
    const renderClientLink = link => {
      if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.innerText = link.split('?').shift();
        clientLink.appendChild(a);
      } else {
        clientLink.innerHTML = '';
      }

      clientLink.style.display = !!link ?
        'block':
        'none';
    };
    const onChannelCreated = channelId => {
      toggleButton();

      renderClientLink(getClientLink(channelId));

      dropChannel.innerText = `${ dropChannelInnerText } ${ channelId }`;
      console.log(`Open ${ getClientLink(channelId) }`);

      return channelId;
    };

    const restoreOrCreate = () => {
      const channelId = window.localStorage.getItem('channelId');

      if (channelId) {
        console.log(`Channel ${ channelId } reopened`);

        channelRenderer.install(channelId).then(onChannelCreated)
      } else {
        console.log(`New channel is created`);

        channelRenderer.install()
          .then(onChannelCreated)
          .then(channelId => {
            window.localStorage.setItem('channelId', channelId);
          })
      }
    };
    const dropChannelClickListener = () => {
      channelRenderer.teardown();
      window.localStorage.removeItem('channelId');

      unToggleButton();
      renderClientLink('');
      dropChannel.innerText = dropChannelInnerText;
    };

    createChannel.addEventListener('click', restoreOrCreate, false);
    dropChannel.addEventListener('click', dropChannelClickListener, false);

    const teardown = () => {
      createChannel.removeEventListener('click', restoreOrCreate, false);
      dropChannel.removeEventListener('click', dropChannelClickListener, false);
      channelRenderer.teardown();
    };

    return {
      restoreOrCreate,
      teardown,
    };
  }

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  return global.interactiveEbook;
})(window));
