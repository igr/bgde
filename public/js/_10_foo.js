/**
 * Selects single element in DOM tree.
 */
function _(selector, src) {
  if (src === undefined) {
    src = document;
  }
  return src.querySelector(selector);
}

/**
 * Selects all matched elements in DOM tree.
 */
function __(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Invokes a callback when DOM is ready.
 */
function ready(callback) {
  // in case the document is already rendered
  if (document.readyState !== 'loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') callback();
    });
}
