require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');

let CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/addon/display/autorefresh');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/html-hint');
require('codemirror/addon/hint/css-hint');
require('codemirror/addon/hint/javascript-hint');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/closetag');
require('codemirror/addon/edit/closebrackets');

(interactiveEbook => {
  'use strict';

  interactiveEbook.prepareContent = ({
    renderEverywhere,
    snippetAttr,
    contentEl
  }) => {
    const contentBreakpoints = {};

    const mainContentWrapperEl = document.querySelector('.exercise-content-wrapper');
    const requestZippedSnippet = (data, images, zipName) => {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST", "/zipit");
      xmlhttp.responseType = "blob";
      xmlhttp.setRequestHeader("Content-Type", "application/json");
      xmlhttp.onload = () => {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = window.URL.createObjectURL(xmlhttp.response);
        link.download = `${zipName}.zip`;
        link.click();
        document.body.removeChild(link);
      };
      xmlhttp.send(JSON.stringify({data: data, images: images, sourceUrl: location.href, zipName: zipName}));
    };
    const exerciseSectionEl = document.querySelector('.exercise');

    // Line indicator is a virtual place somewhere between the top and the bottom
    // of the viewport end. It marks the place where readers eyesight is.
    // Right now we assume the user reads at the exact middle of the page.
    // Later the indicator position can be adjusted if we have some
    const lineIndicatorYPosition = window.innerHeight / 2;

    let activeSnippetName;
    const setActive = breakpoint => {
      activeSnippetName = breakpoint.snippetName;

      updateActiveBookElement(activeSnippetName);
    };

    let activeBookElement;
    const updateActiveBookElement = activeSnippetName => {
      if (activeBookElement) {
        if (activeBookElement == document.querySelector(`[${ snippetAttr }=${ activeSnippetName }]`)) {
          return;
        }
        activeBookElement.classList.remove('active');
      }
      activeBookElement = document.querySelector(`[${ snippetAttr }=${ activeSnippetName }]`);
      let editors = document.querySelectorAll(`[data-snippet-cm=${ activeSnippetName }]`);


      // CM needs to be refreshed to be displayed properly when initialized while invisible

      activeBookElement.classList.add('active');
      ((cm) => {
        if (cm)
          cm.refresh();
      })(CMList[activeSnippetName].find(cm => {
        return cm.getOption('activeCM');
      }));
    };

    const linkSnippetsWithElements = function () {
      const breakpointElements = document.querySelectorAll(`[${ snippetAttr }]`);
      for (let i = 0, ilen = breakpointElements.length; i < ilen; i++) {
        const boundingBox = breakpointElements[i].getBoundingClientRect();
        // todo calculate a center point
        let p = parseInt(breakpointElements[i].offsetTop) - parseInt(parseInt(window.innerHeight ) / 2) - 200;
        if (p < 0) {
          p = 0;
        }
        contentBreakpoints[p] = {
          snippetName: breakpointElements[i].getAttribute(snippetAttr)
        }
      }
    };

    const prepareBreakpoints = DOC_HEIGHT => {
      let currentBreakpoint = null;
      for (let i = 0, ilen = parseInt(getComputedStyle(contentEl).height) +
      (window.innerHeight - lineIndicatorYPosition); i < ilen; i++) {
        if (contentBreakpoints[i]) {
          currentBreakpoint = contentBreakpoints[i];
          continue;
        }
        if (currentBreakpoint && currentBreakpoint !== contentBreakpoints[i]) {
          contentBreakpoints[i] = currentBreakpoint;
        }
      }
    };

    const DOC_HEIGHT = parseInt(getComputedStyle(contentEl).height) +
      (window.innerHeight - lineIndicatorYPosition);


    // Ensures we reader can reach the last breakpoint.
    // TODO: use paddingBottom of content element instead when better
    // breakpoints structure is here.

//    document.body.style.height = DOC_HEIGHT + "px";

    const getSnippetByPageYOffset = pageYOffset => {
      const breakpoint = contentBreakpoints[pageYOffset];
      if (!breakpoint) {
        return;
      }
      setActive(breakpoint);

      // // Note: this prevents `render` from being hot.
      // if (snippetToBeRenderedNow === snippetRenderedBefore) {
      //   return;
      // }
      return interactiveEbook.snippets[activeSnippetName];
    };


    const addCircularMenu = (parent, options) => {
      let btns = options.btns;

      let wrapper = document.createElement('div');
      let menuTrigger = document.createElement('button');
      let ul = document.createElement('ul');


      menuTrigger.setAttribute('title', "Funkcje edytora");

      menuTrigger.addEventListener('click', (ev) => {
        ev.stopPropagation();
        menuTrigger.classList.toggle('open');

        let value = -1;
        if (menuTrigger.matches('.open')) {
          value = 0;
        }
        Array.from(ul.querySelectorAll('button')).forEach(button => {
          button.setAttribute('tabindex', value);
        });
//        let state = menuTrigger.getAttribute('aria-expanded');
      });

      wrapper.addEventListener('click', () => {
        menuTrigger.classList.remove('open');
        menuTrigger.setAttribute('aria-expanded', false);
      });

      wrapper.addEventListener('mouseleave', () => {
        menuTrigger.classList.remove('open');
        menuTrigger.setAttribute('aria-expanded', false);
      });

      btns.forEach(btn => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        button.setAttribute('title', btn.title);
        button.addEventListener('click', btn.action);
        button.classList.add(btn.class);
        button.setAttribute('tabindex', -1);

        if(btn.attr) {
          Object.keys(btn.attr).forEach(attr => {
            button.setAttribute(attr, btn.attr[attr]);
          });
        }

        li.appendChild(button);
        ul.appendChild(li);
      });

      menuTrigger.classList.add('menu-trigger');

      wrapper.classList.add('editor-menu');

      wrapper.appendChild(menuTrigger);
      wrapper.appendChild(ul);

      parent.appendChild(wrapper);
    };

    let CMList = {};

    // Just so the snippets on the left side appear as CodeMirror instances.
    // Will probably need refactor and rename
    const loadSnippets = () => {
      const CodeMirrorOptions = {
        smartIndent: true,
        tabSize: 2,
        lineNumbers: true,
        theme: 'dark-theme',
        lineWrapping: true,
        scrollbarStyle: null,
        inputStyle: 'contenteditable',
        extraKeys: {
          'Ctrl-Alt': 'autocomplete',
          'Esc': cm => {
            let fullscreenEl = document.querySelector('.fullscreen');
            if (fullscreenEl) {
              fullscreenEl.classList.remove('fullscreen');
            }
            document.body.classList.remove('editor-fullscreen');
            cm.getInputField().blur();
          }
        }
      };

      const snippetTriggers = document.querySelectorAll(`[${ snippetAttr }]`);
      snippetTriggers.forEach(el => {
        let snippetName = el.getAttribute(snippetAttr);
        let snippetData = interactiveEbook
                  .snippets[el.getAttribute(snippetAttr)];

        let snippetFiles = snippetData.files;

        let fileNamesToBeRendered = Array.from(el.getAttribute('data-snippet-files').split(','));

        let ul = document.createElement('ul');
        ul.classList.add('tab-switcher');
//        ul.setAttribute('data-snippet-title', el.getAttribute(snippetAttr)); //for now get the snippet name. finally it should be a tittle attr and this line should be deleted

        let cms = [];

        CMList[snippetName] = [];
        addCircularMenu(el, {
            btns: [
                {
                  class: 'button-refresh',
                  action: (self) => {
                    CMList[snippetName].forEach(cm => {
                      cm.setValue(cm.originalFile.contents);
                      cm.originalFile.markers.forEach( marker => {
                        cm.markText(marker.from, marker.to, marker.options)
                      });
                    });
                  },
                  title: "Odśwież edytor",
                  desc: "Przywraca kod w edytorze do stanu początkowego"
                },
                {
                  class: 'button-download',
                  title: 'download snippet',
                  desc: "pobiera snippet",
                  action: (self) => {
                    requestZippedSnippet(snippetFiles, interactiveEbook.assets.img, snippetName);
                  }
                },
                {
                  class: 'button-fullscreen',
                  action: (self) => {
                    document.body.classList.toggle('editor-fullscreen');
                    el.classList.toggle('fullscreen');
                  },
                  title: "Pełny ekran",
                  desc: "Uruchamia tryb pełnoekranowy"
                }
              ],
            file: []
          });


        snippetFiles.forEach((file) => {


          if(!fileNamesToBeRendered.includes(file.fileName)) {
            return;
          }

          var cm = CodeMirror(el, Object.assign({}, CodeMirrorOptions, {
            value: file.contents.trim(),
            mode: file.cmMode
          }));

          cm.originalFile = JSON.parse(JSON.stringify(file));

          CMList[snippetName].push(cm);
          el.classList.add('ready');

          let wrapper = cm.getWrapperElement();

          wrapper.setAttribute('data-snippet-file-name', file.fileName);

          cm.setOption('matchBrackets', true);
          cm.setOption('autoCloseBrackets', true);
          cm.setOption('autoCloseTags', true);
          cm.on('focus', (cm) => {
            cm.refresh();
          });
          cm.on('change', (cm, change) => {
            var snippet = interactiveEbook
                    .snippets[el.dataset.snippetName];

            // TODO make it possible to reset contents to its default
            // if(snippet.type == "page") {
            //   snippet.code = cm.getValue();
            // } else {
            file.contents = cm.getValue();
            // }

            renderEverywhere({
              snippet : snippetData,
              renderOnly : cm.getWrapperElement().getAttribute('data-snippet-file-name')
            });
            setActive({
              snippetName: el.getAttribute(snippetAttr)
            });
          });

          el.addEventListener('click', () => {
            let obj = {
              snippet : snippetData,
            };

            // sometimes we want to run script after each edit for example (even in css)
            // this does that (flexbox case)

            renderEverywhere(obj);
            setActive({
              snippetName: el.getAttribute(snippetAttr)
            });
          });

          let li = document.createElement('li');
          let liButton = document.createElement('button');
          liButton.textContent = file.fileName;
          liButton.setAttribute('title', file.fileName);
          liButton.classList.add('tab-switcher-button');
          li.appendChild(liButton);

          ul.appendChild(li);

          if (el.getAttribute('data-snippet-main') == file.fileName ||
              file.fileName === fileNamesToBeRendered[0] && !el.getAttribute('data-snippet-main')) {
            li.classList.add('active');
            cm.setOption('activeCM', true);
          } else {
            // hide not-active codemirrors
            cm.getWrapperElement().style.display = 'none';
            cm.setOption('activeCM', false);
          }

          let onClick = () => {
            cms.forEach( cm => {
              cm.getWrapperElement().style.display = 'none';
//              cm.refresh();
            });
            cm.getWrapperElement().style.display = 'block';
            cm.refresh();

            // this is for switching between multiple html files
            if (/.html/.test(file.fileName)) {
              renderEverywhere({
                snippet : snippetData,
                renderOnly : cm.getWrapperElement().getAttribute('data-snippet-file-name')
              });
            }

            ul.querySelectorAll('li').forEach(li => {
              li.classList.remove('active');
            });
            li.classList.add('active');
          }

          li.addEventListener('click', onClick);

          cms.push(cm);
          let markers = file.markers.forEach( marker => {
            cm.markText(marker.from, marker.to, marker.options)
          });
        });

        el.prepend(ul);
      });

      const renderlessSnippets = document.querySelectorAll(".renderlessSnippet");
      renderlessSnippets.forEach(el => {
//        let parent = el.parentNode;

//        parent.removeChild(el);
//        let cm = CodeMirror(el, Object.assign({}, CodeMirrorOptions, {
//          value: el.contents.trim(),
//          mode: el.cmMode,
//          readOnly: true
//        }));
      });
    };

    loadSnippets();

    linkSnippetsWithElements();
    prepareBreakpoints(DOC_HEIGHT);
    window.addEventListener('resize', () => {
      contentBreakpoints.length = 0;
      linkSnippetsWithElements();
      prepareBreakpoints(parseInt(getComputedStyle(contentEl).height) +
      (window.innerHeight - lineIndicatorYPosition));
    });
    return {getSnippetByPageYOffset}
  };

})(((global) => {
  global.interactiveEbook = global.interactiveEbook || {};
  return global.interactiveEbook;
})(window));


// CODEMIRROR SHOULD USE SPACES INSTEAD OF TABS - JSON.PARSE ISSUE.
// CTRL + BACKSPACE REMOVES LOCKED TEXT -> HANDLE IT SOMEHOW
// ADD VIDEO BUTTON TO EDITOR
// DISABLE RENDERING WHILE RESIZING
// ON RESIZE RECALCULATE THE OFFSETS
