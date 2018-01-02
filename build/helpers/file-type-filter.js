'use strict';

// Filter an array of files according to file type
//
// TODO: there's gulp-if for that. Use it.
module.exports = function fileTypeFilter(files, extension) {
  const regExp = new RegExp(`\\.${ extension }$`);
  return files.filter(regExp.test.bind(regExp));
};
