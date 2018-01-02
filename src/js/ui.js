import $ from 'jquery';
import split from 'split.js';

export default () => {
  let vertical = null;
  let horizontal = null;

  const $previewEl = $('.exercise-preview');
  const $videoEl = $('.exercise-video');


  const createVertical = () => {
    if (vertical)
      return;

    vertical = split(['.exercise-preview', '.exercise-video'], {
      gutterSize: 10,
      minSize: [100, 100],
      direction: 'vertical'
    });
  };

  const createHorizontal = () => {
    if (horizontal)
      return;

    horizontal = split(['.exercise-content-wrapper', '.exercise-aside-wrapper'], {
      sizes: [65,35],
      minSize: [550, 0], // 50 is width of button.
      gutterSize: 10
    });
  };

  const destroyHorizontal = () => {
    if (!horizontal)
      return;
    horizontal.destroy();
    horizontal = null;
  };

  const destroyVertical = () => {
    if (!vertical)
      return;
    vertical.destroy();
    vertical = null;
  };

  const update = (config) => {
    if (config.mobile) {
      $previewEl.show();
      $videoEl.show();
      destroyVertical();
      destroyHorizontal();
      return;
    }

    if (config.preview) {
      $previewEl.show();
    } else {
      $previewEl.hide();
    }

    if (config.video) {
      $videoEl.show();
    } else {
      $videoEl.hide();
    }

    if (!config.preview && !config.video) {
      hideAside();
      return;
    }

    if (config.preview && config.video) {
      showBoth();
      return;
    }

    showAside();

    if (config.preview != config.video) {
      destroyVertical();
    }
  };

  const hideAside = () => {
    destroyVertical();
    destroyHorizontal();
    document.querySelector('.exercise-aside-wrapper').style.display = 'none';
  };

  const showAside = () => {
    createHorizontal();
    document.querySelector('.exercise-aside-wrapper').style.display = 'flex';
  };

  const showBoth = () => {
    createHorizontal();
    createVertical();

  };

  self = {
    update
  };
  return self;
};
