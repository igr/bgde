
function render(templateSelector, ctx) {
  const template = _(templateSelector);
  const rendered = Mustache.render(template.innerHTML, ctx);

  // convert rendered content to element
  const tempTemplate = document.createElement('template');
  tempTemplate.innerHTML = rendered;

  return {
    attach: (target) => {
      _(target).appendChild(tempTemplate.content.firstElementChild);
    }
  }
}

function detach(query) {
  const e = _(query);
  e.parentNode.removeChild(e);
}
