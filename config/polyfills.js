if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// So we can use Object.entries, etc...
require('babel-polyfill');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

// Shim requestAnimationFrame https://github.com/facebook/jest/issues/4545
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

// Swap out console.error with a version that filters out specific errors.
const error = console.error;
console.error = function() {
  if (typeof arguments[0] !== 'string') {
    return error.apply(console, arguments);
  }
  // Individual unit tests don't pass unused props, so ignore errors
  // where a required prop isn't provided
  if (arguments[0].includes('Warning: Failed prop type:') &&
      arguments[0].includes('but its value is `undefined`.')) {
    return;
  }
  return error.apply(console, arguments);
};

//
