import polyfill from './polyfill';

//todo: extract from koduje-nodejs
//import noTouch from './noTouch';

import './exercise/exercise';
import uiManager from './global/UIManager';

const init = () => {
  uiManager();
  interactiveEbook.init();
};

window.addEventListener('load', function load() {
  // remove listener, no longer needed
  window.removeEventListener('load', load, false);
  init();
});
