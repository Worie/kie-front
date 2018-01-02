import flexAxis from './internal/flexAxis';
import setupAnchors from './internal/setupAnchors';

const modules = [];
const addModule = module => {
  // Push only function contents to the module, trim function notation.
  modules.push(module.toString().replace(/function\s*\(.*\)\s*\{([^]*)\}$/, '$1'));
};

export default config => {
  // This will be added to the document that user experiments on
  addModule(flexAxis);
  addModule(setupAnchors);

  return modules;
};
