
let explainableTooltip = null;
// used for aria
let tooltipCount = 0;

const explainableList = Array.from(document.querySelectorAll('.explainable'));
explainableList.forEach(el => {
  // is delegation better here? :wonder:
  let config = {
    direction: el.getAttribute('data-tooltip-direction'),
    title: el.getAttribute('data-tooltip-title'),
    content: el.getAttribute('data-tooltip-content'),
    triggerEl: el,
    tipId: tooltipCount
  };

  el.addEventListener('click', (ev) => {
    if (ev.target.getAttribute('data-tooltip-active') != 'true') {
      ev.stopPropagation();
      showTooltip(config);
      el.setAttribute('aria-expanded', true);
    }
  });
  el.setAttribute('title', config.content);

  tooltipCount++;
//  //
//  const div = document.createElement('div');
//  div.classList.add('sr-only');
//  const h4 = document.createElement('h4');
//  const p = document.createElement('p');
//  h4.textContent = config.title;
//  p.textContent = config.content;
//  div.appendChild(h4);
//  div.appendChild(p);
//  el.appendChild(div);

});

const removeTooltips = () => {
  const tooltips = Array.from(document.querySelectorAll('.tooltip'));

  tooltips.forEach(tooltip => {
    tooltip.classList.remove('open');
    tooltip.parentNode.removeChild(tooltip);
  });
  explainableList.forEach(el => {
    el.setAttribute('data-tooltip-active', 'false');
    el.setAttribute('aria-expanded', false);
  });

};

const showTooltip = (options) => {
  let {
    title,
    direction,
    content,
    triggerEl,
    tipId
  } = options;

  removeTooltips();

  let tooltipWrapperEl = document.createElement('div');
  let imgEl = document.createElement('img');

  tooltipWrapperEl.classList.add('tooltip'); // remember about changing th styles
  tooltipWrapperEl.classList.add(`tooltip-${direction}`); // remember about changing th styles
  tooltipWrapperEl.setAttribute('role', 'tooltip');

  imgEl.classList.add(`tooltip-img-${direction}`);
  // stupid workaround for path replacement in standalone exercises (it replaces /assets/images/ to ../images)
  // move it to the task somehow perhaps
  imgEl.src = `./assets`+`/images/exercise-tooltips/wojtek-${direction}.svg`;
  imgEl.alt = "Wojtek Połowniak";

  let tooltipEl = document.createElement('div');
  tooltipEl.classList.add('explainable-tooltip');

//  tooltipEl.setAttribute('id', `tip${tipId}`);
//  triggerEl.setAttribute('aria-describedby', `tip${tipId}`);

  let barEl = document.createElement('div');
  barEl.classList.add('tooltip-bar');

  let titleEl = document.createElement('h5');
  titleEl.classList.add('tooltip-heading');
  titleEl.textContent = title;

  let closeEl = document.createElement('button');
  closeEl.textContent = "Zamknij";

  closeEl.addEventListener('click', function del() {
    tooltipWrapperEl.classList.remove('open');
    setTimeout(() => {
      explainableTooltip.parentNode.removeChild(tooltipWrapperEl);
      closeEl.removeEventListener('click', del);
    }, 400);
  });

  let tooltipBodyEl = document.createElement('div');
  tooltipBodyEl.textContent = content;
  tooltipBodyEl.classList.add('tooltip-body');


  barEl.appendChild(titleEl);
  barEl.appendChild(closeEl);

  tooltipEl.appendChild(barEl);

  tooltipEl.appendChild(tooltipBodyEl);


  tooltipWrapperEl.appendChild(imgEl);
  tooltipWrapperEl.appendChild(tooltipEl);
  document.body.appendChild(tooltipWrapperEl);
  options.triggerEl.setAttribute('data-tooltip-active', 'true');

  setTimeout(() => {
    tooltipWrapperEl.classList.add('open');
  }, 100);
};

const wrapperEl = document.querySelector('.exercise-content-wrapper');
wrapperEl.addEventListener('click', removeTooltips, false);
