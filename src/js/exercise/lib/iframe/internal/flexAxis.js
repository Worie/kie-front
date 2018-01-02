export default moduleConfig => {
  const {
    document
  } = moduleConfig;

  window.koduje = {};
  window.koduje.createAxis = function (config) {

    var computed = getComputedStyle(config.parent);
    var x = "";
    var y = "";
    if (computed['display'] != 'flex') {
      return;
    }

    if (computed['flex-direction'].indexOf('row') > -1) {
      x = 'main-axis';
      y = 'cross-axis';

      if (computed['flex-direction'].indexOf('reverse') > -1) {
        x += " reverse";
      }

      if (computed['flex-wrap'] == 'wrap-reverse') {
        y += " reverse";
      }

    } else if (computed['flex-direction'].indexOf('column') > -1) {
      y = 'main-axis';
      x = 'cross-axis';

      if (computed['flex-direction'].indexOf('reverse') > -1) {
        y += " reverse";
      }

      if (computed['flex-wrap'] == 'wrap-reverse') {
        x += " reverse";
      }
    }

    var wrapper = document.createElement('div');
    var overlay = config.overlay || "";
    var htmlString = '<div class="koduje_axis_overlay '+ overlay +'"><div class="axis y-axis ' + y + '"><span>y</span></div><div class="axis x-axis ' + x +'"><span>x</span></div>';


    // make sure we can show legend
    if (parseFloat(computed['width']) / 2 > 100 && parseFloat(computed['height']) / 2 > 55)  {
      htmlString += '<div class="legend"><div class="main-axis">Główna oś (main-axis)</div><div class="cross-axis">Oś przeciwstawna (cross-axis)</div></div></div>';
    }

    wrapper.innerHTML = htmlString;
    config.parent.appendChild(wrapper.firstChild);

  //  window.koduje.handledParents.push(config.parent);
    };
  window.koduje.removeAllAxis = function () {
    document.querySelectorAll('.koduje_axis_overlay').forEach(function (overlay) {
      overlay.parentNode.removeChild(overlay);
    });
  };
  window.koduje.drawAllFlexTips = function (config) {
    document.querySelectorAll('.koduje-flex-tip').forEach(function (container) {
      window.koduje.removeAllAxis();
      window.koduje.createAxis({
        parent: container
      });
    });
  }

  document.addEventListener('mouseenter', window.koduje.drawAllFlexTips);


  // I dont really have any other simple idea for it.
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  styleEl.setAttribute('data-snippet-locked', true);
  styleEl.innerHTML = `
.koduje-flex-tip {
  position: relative;
  pointer-events: all;
}

.koduje-flex-tip:hover > .koduje_axis_overlay {
  display: block;
}

.koduje_axis_overlay {
  z-index: 2;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.koduje_axis_overlay.visible {
  display: block;
}

.koduje_axis_overlay.hidden {
  display: none !important;
}

.koduje_axis_overlay .axis {
  content: '';
  display: block;
  position: absolute;
  opacity: 0.3;

  pointer-events: none;
  background: blue;
  color: blue;
}

.koduje_axis_overlay .main-axis {
  opacity: 0.8;
}


.koduje_axis_overlay .axis span {
  position: absolute;
}

.koduje_axis_overlay .x-axis::after {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 13px solid blue;
  content: '';
  display: block;
  right: -1px;
  position: absolute;
  top: -8.5px;
}


.koduje_axis_overlay .y-axis::after {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 13px solid blue;
  content: '';
  display: block;
  position: absolute;
  left: -5px;
  bottom: -6px;
  transform: rotate(-270deg);
}

.koduje_axis_overlay .x-axis span {
  right: 20px;
  top: 5px;
}

.koduje_axis_overlay .y-axis span {
  left: 10px;
  bottom: 20px;
}

.koduje_axis_overlay .x-axis {
  height: 3px;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}


.koduje_axis_overlay .y-axis {
  width: 3px;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  margin: auto;
}

.koduje_axis_overlay .x-axis.reverse {
  transform: rotateY(180deg);
}

.koduje_axis_overlay .x-axis.reverse span {
  transform: rotateY(-180deg);
}

.koduje_axis_overlay .y-axis.reverse {
  transform: rotateX(180deg);
}

.koduje_axis_overlay .y-axis.reverse span {
  transform: rotateX(-180deg);
}

.koduje_axis_overlay .legend {
  width: 200px;
  font-size: 11px;
  color: black;
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  height: 55px;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.70);}

.koduje_axis_overlay .legend div {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  padding: 3px;
}

.koduje_axis_overlay .legend .main-axis::before {
  opacity: 0.8;
}

.koduje_axis_overlay .legend .cross-axis::before {
  opacity: 0.3;
}

.koduje_axis_overlay .legend .main-axis::before,
.koduje_axis_overlay .legend .cross-axis::before {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: blue;
  content: '';
  margin-right: 5px;
}
`;

};
