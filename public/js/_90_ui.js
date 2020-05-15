
function signedIn(user) {
  theUser = user;
  _('#login').style.display = 'none';
  _('#user').style.display = 'block';
  _('img', _('#user')).src = user.photoURL;
}

function signedOut() {
  theUser = null;
  _('#login').style.display = 'block';
  _('#user').style.display = 'none';
}

function initLogin() {
  _('#login').addEventListener('click', () => {
    showModal("#firebaseui-auth-container");
  });
  _('#logout').addEventListener('click', () => {
    auth.signOut().then(() => {
      location.reload();
    });
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
