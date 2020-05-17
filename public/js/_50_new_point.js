const MAX_TITLE = 51;
const MAX_DESC = 4000;

function initAddNewPointDialog() {
  _('#emotion').addEventListener('click', () => {
    changeEmotion();
  });
}

function addNewPoint(lat, lng) {
  emotion = 0;
  showModal('#add');
  const add = _('#add');
  _('[name="lng"]', add).value = lng;
  _('[name="lat"]', add).value = lat;
  resetNewPointForm();
  if (!theUser) {
    addNewPointError('Морате бити пријављени да би додавали места!');
  }
}

function changeEmotion() {
  emotion += 1;
  if (emotion > MAX_EMOTIONS) {
    emotion = 1;
  }
  _("#emotion").style.backgroundImage = 'url(' + iconbase + `/em-${emotion}.png)`;
}

function resetNewPointForm() {
  const add = _('#add');
  _('[name="opis"]', add).value = '';
  _('[name="naziv"]', add).value = '';
}

function submitNewPoint(e) {
  const add = e;
  const title = _('[name="naziv"]', add).value.substring(0, MAX_TITLE);
  const description = _('[name="opis"]', add).value.substring(0, MAX_DESC);
  const lng = parseFloat(_('[name="lng"]', add).value);
  const lat = parseFloat(_('[name="lat"]', add).value);

  if (!theUser) {
    addNewPointError('Морате бити пријавлјени да би додавали места!');
    return false;
  }
  if (emotion === 0) {
    addNewPointError("Изабери емотикон кликом на знак питања.")
    return false;
  }
  if (title.length < 7) {
    addNewPointError("Назив мора имати бар 7 знакова.")
    return false;
  }
  if (description.length < 21) {
    addNewPointError("Опис мора имати бар 21 знак.")
    return false;
  }
  clearNewPointError();
  storeNewPoint(emotion, title, description, theUser.uid, lat, lng)
    .then((docRef) => {
      removeMapMarker();
      closeModals();
    });

  return false;
}

function addNewPointError(msg) {
  _('.error').innerText = msg;
  _('.error').style.display = 'block';
}

function clearNewPointError() {
  _('.error').style.display = 'none';
}

function storeNewPoint(emotionId, name, description, userId, lat, lng) {
  return db.collection('points').add({
    a: false,
    d: description,
    e: emotionId,
    n: name,
    u: userId,
    x: new firebase.firestore.GeoPoint(lat, lng),
    t: firebase.firestore.FieldValue.serverTimestamp(),
  })
  .catch(function(error) {
    showAlert('Неуспешна операција.')
    console.error('Error writing to database', error);
  });
}
