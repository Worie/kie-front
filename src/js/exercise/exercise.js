import 'array-includes';

import './common.js';
import './prepareContent.js';
import './channelSupport.js';
import './renderer/embeddedIframe.js';
import './renderer/spawnedWindow.js';
import './renderer/channel.js';

import './splitView.js';
import './view.js';

import './tooltips.js';
import './youtube.js';
import './youtubeLinks.js';

(interactiveEbook => {
  var modalEl = document.querySelector('.exercise-modal');

  // Those are utils. Move them
  const throttle = function (callback, limit) {
    let wait = false;
    return function () {
      if (!wait) {
        callback();
        wait = true;
        setTimeout(function () {
          wait = false;
        }, limit);
      }
    };
  };

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
};

  document.querySelectorAll('.code-fragment').forEach(span => {
    span.addEventListener('dblclick', () => {
      window.getSelection().selectAllChildren(span);
    });
  });

  const spawnWindowSelector = '#spawnWindow';
//  const createChannelSelector = '#createChannel';
//  const dropChannelSelector = '#dropChannel';
  const clientLinkSelector = '#clientLink';

  const exerciseEl = document.querySelector('.exercise');
  const mainContentWrapperEl = document.querySelector('.exercise-content-wrapper');
  const previewContainerEl = document.querySelector('.exercise-preview');
  const contentEl = document.querySelector('.exercise-content');
//  let $payModal = $('#payModal');

  const init = () => {
    const {
      render: iframeRender,
      install: iframeInstall,
      teardown: iframeTeardown,
    } = interactiveEbook.renderers.embeddedIframe(previewContainerEl);

    interactiveEbook.spawned = interactiveEbook.renderers.spawnedWindow();

    const {
      render: spawnedWindowRender,
      install: spawnedWindowInstall,
      teardown: spawnedWindowTeardown,
    } = interactiveEbook.spawned;

    const channelRenderer = interactiveEbook.renderers.channel();

//    const {
//      teardown: channelSupportTeardown,
//    } = interactiveEbook.channelSupport({
//      createChannelSelector,
//      dropChannelSelector,
//      clientLinkSelector,
//      channelRenderer,
//    });



    const renderEverywhere = snippet => {
      iframeRender(snippet);
      spawnedWindowRender(snippet);
      channelRenderer.render(snippet);
    };
    const {
      getSnippetByPageYOffset,
    } = interactiveEbook.prepareContent({
      renderEverywhere,
      contentEl,
      snippetAttr: 'data-snippet-name',
    });


    window.interactiveEbook.lastRenderedSnippet = null;;

    const scrollListener = () => {
      const snippetToBeRendered = getSnippetByPageYOffset(mainContentWrapperEl.scrollTop);

      // This prevents `renderEverywhere` from being hot.
      if (snippetToBeRendered !== window.interactiveEbook.lastRenderedSnippet) {
        renderEverywhere({snippet: snippetToBeRendered});
        window.interactiveEbook.lastRenderedSnippet = snippetToBeRendered;
      }
    };

    const clientInstallListener = event => {
      if (event.origin !== location.origin) {
//        console.log('ignoring message from different origin');
      }

//      if (event.data.startsWith('clientInstallationFailed:')) {
////        console.error('in iframe client:',
////          event.data.split('clientInstallationFailed:').pop());
//      }
    };

    const spawnWindowClickListener = () => {
      // TODO: allow many windows to be spawned.
      spawnedWindowTeardown();
      spawnedWindowInstall();
    };

//
//    if (modalEl) {
//
//      var btnNext = document.querySelector('.modal-details .see-more');
//      btnNext.addEventListener('click', () => {
//        modalEl.classList.remove('initial');
//      });
//      var btnBack = document.querySelector('.exercise-modal-title .arrow-back');
//      btnBack.addEventListener('click', () => {
//        modalEl.classList.add('initial');
//      });
//      // todo: fix responsive when resizing
//      let viewportHeight = window.innerHeight;
//
//      mainContentWrapperEl.addEventListener('scroll', () => {
//        if (mainContentWrapperEl.scrollTop >= parseInt(getComputedStyle(contentEl).height) - (window.innerHeight)*2) {
//          modalEl.classList.add('open');
//          exerciseEl.classList.add('blurred');
//        } else {
//          modalEl.classList.remove('open');
//          exerciseEl.classList.remove('blurred');
//        }
//      }, false);
//
//    }

    mainContentWrapperEl.addEventListener('scroll', scrollListener, false);
    window.addEventListener('message', clientInstallListener, false);

//    const spawnWindow = document.querySelector(spawnWindowSelector);
//    spawnWindow.addEventListener('click', spawnWindowClickListener, false);

    iframeInstall();

    const teardown = () => {
      iframeTeardown();
      mainContentWrapperEl.removeEventListener('scroll', scrollListener, false);
      lastRenderedSnippet = undefined;
      window.removeEventListener('message', clientInstallListener, false);
      spawnWindow.removeEventListener('click', spawnWindowClickListener, false);

      channelSupportTeardown();
    };


//    Array.from(document.querySelectorAll(".CodeMirror-scroll")).forEach(cmScrollArea => {
//      let scrollPosible = false;
//      cmScrollArea.addEventListener('scroll', () => {
//        scrollPosible = true;
//      });
//
//      cmScrollArea.addEventListener('mousewheel', () => {
//        if (scrollPosible)
//          mainContentWrapperEl.classList.add('snippet-scroll');
//      });
//      cmScrollArea.addEventListener('mousewheel', debounce(() => {
//        mainContentWrapperEl.classList.remove('snippet-scroll');
//        scrollPosible = false;
//      }, 100));
//    })
    return {teardown};
  };

  interactiveEbook.init = init;

})((global => {
  global.interactiveEbook = global.interactiveEbook || {};
  return global.interactiveEbook;
})(window));
