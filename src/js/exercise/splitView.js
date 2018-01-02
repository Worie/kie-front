import $ from 'jquery';

import panel from '../managementPanel.js';
import panelButton from '../panelButton.js';
import ui from '../ui.js';

// Make it available to keyboard scroll (default is to body);
$('.exercise-content').focus();

const exerciseSectionEl = document.querySelector('.exercise');
const managementPanel = panel({
  parentEl: document.querySelector('.exercise')
});

window.interactiveEbook.viewConfig = {
  preview: true,
  video: (window.interactiveEbook.ytUrl ? true : false),
};

const {
  update
} = ui();

update(window.interactiveEbook.viewConfig);

//managementPanel.add({
//  entity: panelButton({
//    classNames: 'management-panel-button management-panel-button--menu',
//    textContent: "",
//    turnOn: () => {
//
//    },
//    turnOff: () => {
//
//    },
//    defaultState: false
//  }),
//  groupName: 'menu'
//  }
//);

managementPanel.add({
  entity: panelButton({
    classNames: 'management-panel-button management-panel-button--home',
    textContent: "",
    turnOn: () => {
      let url =  "/";
      if (window.interactiveEbook.courseRoot) {
        location.href = url += window.interactiveEbook.courseRoot;
      }
    },
    turnOff: () => {

    },
    defaultState: false,
    title: "Strona główna kursu"
  }),
  groupName: 'menu'
  }
);


const nextBtn = panelButton({
  classNames: 'management-panel-button management-panel-button--arrow-right',
  textContent: "",
  turnOn: () => {
    if (window.interactiveEbook.nextUrl) {
      location.href = "/" + window.interactiveEbook.nextUrl;
    }
  },
  turnOff: () => {
  },
  defaultState: false,
  title: "Następny rozdział"
});

managementPanel.add({
  entity: nextBtn,
  groupName: 'navigation'
});

const prevBtn = panelButton({
    classNames: 'management-panel-button management-panel-button--arrow-left',
    textContent: "",
    turnOn: () => {
      if (window.interactiveEbook.previousUrl) {
        location.href = "/"+window.interactiveEbook.previousUrl;
      }
    },
    turnOff: () => {

    },
    defaultState: false,
    title: "Poprzedni rozdział"
  })

managementPanel.add({
  entity: prevBtn,
  groupName: 'navigation'
});

if (!window.interactiveEbook.previousUrl) {
  prevBtn.disable();
  prevBtn.setAttribute('title', "Brak wcześniejszych rozdziałów");
}

if (!window.interactiveEbook.nextUrl) {
  nextBtn.disable();
  nextBtn.setAttribute('title', "Brak kolejnych rozdziałów");
}


const spawnButton = panelButton({
  classNames: 'management-panel-button management-panel-button--spawn-window',
  textContent: "",
  turnOn: (self) => {
    interactiveEbook.spawned.install(self);
  },
  turnOff: () => {
    interactiveEbook.spawned.teardown();
  },
  defaultState: false,
  title: "Podgląd w nowym oknie"
});

managementPanel.add({
  entity: spawnButton,
  groupName: 'ui'
  }
);

setTimeout(()=>{
  if (window.adBlockDetected) {
    spawnButton.disable();
    spawnButton.setAttribute('title', "Oprogramowanie blokujace reklamy uniemożliwia korzystanie z tej funkcjonalności. Wyłącz je i odśwież stronę.");
  }
},6000);

const previewButton = panelButton({
  classNames: 'management-panel-button management-panel-button--eye',
  textContent: "",
  turnOn: () => {
    window.interactiveEbook.viewConfig.preview = true;
    update(window.interactiveEbook.viewConfig);
  },
  turnOff: () => {
    window.interactiveEbook.viewConfig.preview = false;
    update(window.interactiveEbook.viewConfig);
  },
  defaultState: true,
  title: "Pokaż/ukryj podgląd"
});

managementPanel.add({
  entity: previewButton,
  groupName: 'ui'
  }
);


if (window.interactiveEbook.ytUrl) {
  const videoButton = panelButton({
    classNames: 'management-panel-button management-panel-button--player',
    textContent: "",
    turnOn: () => {
      window.interactiveEbook.viewConfig.video = true;
      update(window.interactiveEbook.viewConfig);
    },
    turnOff: () => {
      window.interactiveEbook.viewConfig.video = false;
      update(window.interactiveEbook.viewConfig);
    },
    defaultState: true,
    title: "Pokaż/ukryj odtwarzacz wideo"
  });

  managementPanel.add({
    entity: videoButton,
    groupName: 'ui'
    }
  );
}



//gutters.push(

//);

//ondrag unfold buttons

//gutters.push(

//);

//gutters[1].onDrag

//const onPreviewButtonClick = function () {
//  var span = previewFoldButton.querySelector('span');
//
//  if (window.interactiveEbook.ytUrl) {
//    videoSectionEl.classList.toggle('maximized');
//  }
//
//  previewSectionEl.classList.toggle('folded');
//  exerciseSectionEl.classList.toggle('preview-hidden');
//
//  if (previewSectionEl.className.indexOf('folded') === -1) {
//    span.textContent = 'Zwiń podgląd';
//  } else {
//    span.textContent = 'Rozwiń podgląd';
//  }
//};
//
//
//if (window.interactiveEbook.ytUrl) {
//
//  const videoSectionEl = asideWrapperEl.querySelector('.exercise-video');
//  const videoFoldButton = videoSectionEl.querySelector('.fold-button');
//
//  const onVideoButtonClick = function () {
//    var span = videoFoldButton.querySelector('span');
//
//    previewSectionEl.classList.toggle('maximized');
//    videoSectionEl.classList.toggle('folded');
//
//    exerciseSectionEl.classList.toggle('video-hidden');
//
//    if (videoSectionEl.className.indexOf('folded') === -1) {
//      span.textContent = 'Zwiń wideo';
//    } else {
//      span.textContent = 'Rozwiń wideo';
//    }
//  };
//
//  videoFoldButton.addEventListener('click', onVideoButtonClick);
//}
//previewFoldButton.addEventListener('click', onPreviewButtonClick);

let breakpoints = {
  medium: 768,
  desktop: 1024
};

let mediaQueries = {
  mobile: "only screen and (max-width: " + (breakpoints.medium - 1) + "px)",
  medium: "only screen and (min-width: " + breakpoints.medium + "px)",
  desktop: "only screen and (min-width: " + breakpoints.desktop + "px)"
};

const desktopViewport = window.matchMedia(mediaQueries.medium);
const desktopViewportHandler = mql => {
  // When desktop viewport is active
    if (mql.matches) {
      exerciseSectionEl.classList.remove('show-preview-area');
      exerciseSectionEl.classList.remove('show-video-area');
      window.interactiveEbook.viewConfig.mobile = false;
      window.interactiveEbook.viewConfig.preview = true;
    } else {
      window.interactiveEbook.viewConfig.mobile = true;
    }


  update(window.interactiveEbook.viewConfig);


};

desktopViewport.addListener(desktopViewportHandler);

desktopViewportHandler(desktopViewport);




let layoutOptions = {
  contentSplit: {
    sizes: [],
    minSize: [],
  },
  asideSplit: [],
  previewSection: {
    folded: false
  },
  videoSection: {
    folded: false
  },
};
