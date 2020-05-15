
function signedIn(user) {
  console.log("AUTH");
  theUser = user;
}

function signedOut() {
  theUser = null;
}

function initLogin() {
  _('#login').addEventListener('click', () => {
    showModal("#firebaseui-auth-container");
  });
}

function showModal(selector) {
  const el = _(selector);
  el.style.display = 'block';
  el.style.zIndex = '100';
}

function closeModals() {
  const modals = __(".modal");
  for (el of modals) {
    el.style.display = 'none';
    el.style.zIndex = '-1';
  }
}

function initModalDialog() {
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    let isEscape;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      closeModals();
    }
  };
  const modals = __(".modal");
  for (el of modals) {
    _('.close', el).addEventListener('click', () => {
      closeModals();
    });
  }
}
