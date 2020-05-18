// ten - super simple framework

function _(selector, src) {
  if (src === undefined) {
    src = document;
  }
  return src.querySelector(selector);
}
function __(selector, src) {
  if (src === undefined) {
    src = document;
  }
  return src.querySelectorAll(selector);
}
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

function runScripts(el) {
  Array.from(el.querySelectorAll("script")).forEach( oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach(
        attr => newScript.setAttribute(attr.name, attr.value)
      );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

Mustache.tags = [ '[[', ']]' ];

function render(templateSelector, ctx) {
  const template = _(templateSelector);
  const rendered = Mustache.render(template.innerHTML, ctx);

  // convert rendered content to element
  const tempTemplate = document.createElement('template');
  tempTemplate.innerHTML = rendered;

  return {
    attach: (target) => {
      const child = _(target).appendChild(tempTemplate.content.firstElementChild);
      child.setAttribute('data-ten', 'true'); // marker
      runScripts(child);
      return child;
    }
  }
}

function detach(queryOrElement) {
  let e = typeof queryOrElement === 'string' ? _(queryOrElement) : queryOrElement;
  if (!e) {
    return;
  }
  while (true) {
    if (e.getAttribute('data-ten')) {
      if (e.parentNode) {
        e.parentNode.removeChild(e);
      }
      return;
    }
    e = e.parentNode;
    if (e === null) {
      break;
    }
  }
}
