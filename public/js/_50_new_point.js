function initAddNewPointDialog() {
  _('#emotion').addEventListener('click', () => {
    changeEmotion();
  });
}

function addNewPoint(lat, lng) {
  emotion = 1;
  showModal('#add');
}

function changeEmotion() {
  emotion += 1;
  if (emotion > MAX_EMOTIONS) {
    emotion = 1;
  }
  _("#emotion").style.backgroundImage = 'url(' + iconbase + `/em-${emotion}.png)`;
}

function submitNewPoint(e) {
  console.log(e);
  const title = _("input", e).value;
  const description = _("textarea", e).value;
}

