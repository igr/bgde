
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
    showAuthModal("#firebaseui-auth-container");
  });
  _('#logout').addEventListener('click', () => {
    auth.signOut().then(() => {});
  });
}

function showAuthModal(selector) {
  const el = _(selector);
  el.style.display = 'block';
  el.style.zIndex = '100';
  onEscapeKey(() => {
    closeModals();
  });
}

function closeModals() {
  const modals = __(".modal");
  for (el of modals) {
    el.style.display = 'none';
    el.style.zIndex = '-1';
  }
  onEscapeKey(() => {});
}
