// Modules are passed from each frame that needs it via getEmbeddedInternalScript

export default config => {
  const {
    chapterId,
    document,
    modules
  } = config;

  const moduleConfig = {
    document,
    chapterId
  };

  modules.forEach(module => {
    new Function("moduleConfig", module).call(undefined, moduleConfig);
  });
};
