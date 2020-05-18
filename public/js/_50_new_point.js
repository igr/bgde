const MAX_TITLE = 51;
const MAX_DESC = 4000;
const MAX_EMOTIONS = 4;
let emotion = 0;

function showNewPoint(lat, lng) {
  showEditPoint({
    data: {
      e: 0,
      x: {
        latitude: lat,
        longitude: lng
      }
    }
  })
}

function showEditPoint(ctx) {
  detach('#add');

  const dialog = render('#_add', ctx).attach('body');

  _('.close', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });
  onEscapeKey(() => {
    closeNewPoint(dialog);
  })

  emotion = ctx.data.e - 1;
  changeEmotion();
  if (!theUser) {
    showAlert('Морате бити пријављени да би додавали места!');
  }
}

function closeNewPoint(dialog) {
  detach(dialog);
  onEscapeKey(() => {});
}

function changeEmotion() {
  emotion += 1;
  if (emotion > MAX_EMOTIONS) {
    emotion = 1;
  }
  _("#emotion").style.backgroundImage = 'url(' + iconbase + `/em-${emotion}.png)`;
}

function submitPoint(dialog) {
  const docId = _('[name="id"]', dialog).value;
  const title = _('[name="naziv"]', dialog).value.substring(0, MAX_TITLE);
  const description = _('[name="opis"]', dialog).value.substring(0, MAX_DESC);
  const lng = parseFloat(_('[name="lng"]', dialog).value);
  const lat = parseFloat(_('[name="lat"]', dialog).value);

  if (!theUser) {
    showFormError('Морате бити пријављени да би додавали места!');
    return false;
  }
  if (emotion === 0) {
    showFormError("Изабери емотикон кликом на знак питања.")
    return false;
  }
  if (title.length < 5) {
    showFormError("Назив мора имати бар 5 знакова.")
    return false;
  }
  if (description.length < 21) {
    showFormError("Опис мора имати бар 21 знак.")
    return false;
  }
  clearFormError();
  if (docId) {
    updatePoint(docId, emotion, title, description, theUser.uid)
      .then((docRef) => {
        removeMapMarker();
        closeNewPoint(dialog);
      });
  }
  else {
    storeNewPoint(emotion, title, description, theUser.uid, lat, lng)
      .then((docRef) => {
        removeMapMarker();
        closeNewPoint(dialog);
      });
  }

  return false;
}

function showFormError(msg) {
  _('.form_error').innerText = msg;
  _('.form_error').style.display = 'block';
}

function clearFormError() {
  _('.form_error').style.display = 'none';
}
