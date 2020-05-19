
const iconbase = '/gfx';
function navigate(lat, lng){
  if( (navigator.platform.indexOf("iPhone") != -1)
    || (navigator.platform.indexOf("iPod") != -1)
    || (navigator.platform.indexOf("iPad") != -1))
    window.open(`maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`);
  else
    window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`);
}
// ten - super simple framework

function _(selector, src, callback) {
  if (src === undefined) {
    src = document;
  }
  const element = src.querySelector(selector);
  if (callback && element) {
    callback(element);
  }
  return element;
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
function toggleClass(el, className) {
  if (!el) return;
  if (!el.classList) {
    el.className += ' ' + className;
    return;
  }
  if (el.classList.contains(className)) {
    el.classList.remove(className);
  }
  else {
    el.classList.add(className);
  }
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

function onEscapeKey(fn) {
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    let isEscape;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      fn();
    }
  };
}
const styles =
  [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "weight": "2.00"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#9c9c9c"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2f2f2"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7b7b7b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#46bcec"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c8d7d4"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#070707"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    }
  ]
let map;
function createMapSwitchTypeControl(controlDiv, map) {
  const controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '10px';
  controlUI.style.marginRight = '10px';
  controlUI.style.width = '40px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Тип мапе';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  const controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '●';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    if (map.getMapTypeId() !== google.maps.MapTypeId.ROADMAP) {
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }
    else {
      map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    }
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 44.787197, lng: 20.457273},
    minZoom: 12,
    zoom: 12,
    clickableIcons: false,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite'],
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    styles,
    restriction: {
      latLngBounds: {
        east: 20.60,
        west: 20.30,
        north: 44.880,
        south: 44.740,
      },
    },
  });

  map.setZoom(13);

  // mapTypeSwitchControl

  const mapTypeSwitchControl = document.createElement('div');
  const centerControl = new createMapSwitchTypeControl(mapTypeSwitchControl, map);

  mapTypeSwitchControl.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapTypeSwitchControl);

  initMapMarker();
}
let marker;

function initMapMarker() {
  const infowindow = new google.maps.InfoWindow({
    pixelOffset:new google.maps.Size(0, -10)
  });
  marker = new google.maps.Marker({
    icon: iconbase + '/map-star.png',
    draggable: true,
    map
  });

  map.addListener('rightclick', (e) => {
    marker.setMap(map);
    marker.setPosition(e.latLng);
    infowindow.setContent(
      "<div class='infoo'><a href='#' class='star' onclick='showNewPoint" + e.latLng + "; return false;'>Додај место ⮕</a></div>")
    ;
    infowindow.open(map, marker);
  });
  google.maps.event.addListener(infowindow,'closeclick', () => {
    removeMapMarker();
  });
}

function removeMapMarker() {
  marker.setMap(null);
}
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

function showPointDialog(id, data) {
  detach('#point');

  const dialog = render('#_point', {data, theUser}).attach('body');

  _('.close', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });
  _('button', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });
  _('#deletePoint', dialog, e => {
    e.addEventListener('click', () => {
      closePointDialog(dialog);
      deletePoint(id);
    });
  });
  _('#editPoint', dialog, e => {
    e.addEventListener('click', () => {
      closePointDialog(dialog);
      showEditPoint({id, data})
    });
  });

  onEscapeKey(() => {closePointDialog(dialog);});
}

function closePointDialog(dialog) {
  detach(dialog);
  onEscapeKey(() => {});
}
let auth;
let db;

firebaseConfig = {
  apiKey: "AIzaSyAj0GInhoN4pxHcs259t3YxefXIoh4JLCg",
  authDomain: "bgde.rs",
  databaseURL: "https://bgde-173.firebaseio.com",
  projectId: "bgde-173",
  storageBucket: "bgde-173.appspot.com",
  messagingSenderId: "705918056064",
  appId: "1:705918056064:web:a8fec83e889d03b90e1865",
  measurementId: "G-TSS281LRSC"
};

function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();

  // auth UI
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
    },
    signInSuccessUrl: '/',
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '/uslovi-koriscenja',
    privacyPolicyUrl: '/politika-privatnosti',
  };

  // Initialize the FirebaseUI Widget using Firebase
  const ui = new firebaseui.auth.AuthUI(auth);
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  auth.onAuthStateChanged(function(user) {
    if (user) {
      signedIn(user);
    } else {
      signedOut();
    }
  });
}

const points = {};

function fetchPoints() {
  Popup = createPopupClass();

  const query = db
    .collection("points")
    .orderBy('t', 'desc');

  query.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(function (change) {
        const id = change.doc.id;
        if (change.type === 'removed') {
          const p = points[id];
          p.marker.setMap(null);
          delete points[id];
        } else {
          // both modified and created

          if (change.type === 'modified') {
            const p = points[id];
            p.marker.setMap(null);
          }

          const data = change.doc.data();
          const marker = new google.maps.Marker({
            icon: iconbase + `/em-${data.e}.png`,
            position: {
              lat: data.x.latitude,
              lng: data.x.longitude,
            },
            map
          });

          marker.addListener('mouseover', () => { showPointInfo(map, id, data); });
          marker.addListener('click', () => { showPointDialog(id, data); });

          points[id] = {
            marker: marker,
            data: data,
          }
        }
      });
    }
  );
}
let popup, Popup;

function showPointInfo(map, id, data) {
  if (popup) {
    popup.setMap(null);
  }
  popup = new Popup(id, data);
  popup.setMap(map);
}

function closePointInfo() {
  popup.setMap(null);
}

/**
 * Returns the Popup class.
 *
 * Unfortunately, the Popup class can only be defined after
 * google.maps.OverlayView is defined, when the Maps API is loaded.
 * This function should be called by initMap.
 */
function createPopupClass() {
  function Popup(id, data) {
    this.position = new google.maps.LatLng(data.x.latitude, data.x.longitude);
    const contentText = data.n;
    const emotion = data.e;

    const content = document.createElement('div');
    content.classList.add('popup-bubble');

    const img = document.createElement('img');
    img.src = iconbase + `/em-${emotion}.png`;
    content.appendChild(img);
    const span = document.createElement('span')
    span.appendChild(document.createTextNode(contentText));
    content.appendChild(span);

    content.addEventListener('mouseout', () => { closePointInfo(); });
    content.addEventListener('click', () => { showPointDialog(id, data); });


    // This zero-height div is positioned at the bottom of the bubble.
    const bubbleAnchor = document.createElement('div');
    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('popup-container');
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
  }

  // ES5 magic to extend google.maps.OverlayView.
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  /** Called when the popup is added to the map. */
  Popup.prototype.onAdd = function() {
    this.getPanes().floatPane.appendChild(this.containerDiv);
    this.containerDiv.style.zIndex = 50;
  };

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
      this.containerDiv.style.zIndex = '-1';
    }
  };

  /** Called each frame when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
    const divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

    // Hide the popup when it is far out of view.
    const display =
      Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';

    if (display === 'block') {
      this.containerDiv.style.left = divPosition.x + 'px';
      this.containerDiv.style.top = divPosition.y + 'px';
    }
    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  };

  return Popup;
}
function storeNewPoint(emotionId, name, description, userId, lat, lng) {
  return db
    .collection('points')
    .add({
      a: false,
      d: description,
      e: emotionId,
      n: name,
      u: userId,
      x: new firebase.firestore.GeoPoint(lat, lng),
      t: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(function (error) {
      showAlert('Нажалост, записивање није успело.')
      console.error('Error writing to database', error);
    });
}

function updatePoint(uid, emotionId, name, description, userId) {
  return db
    .collection('points')
    .doc(uid)
    .update({
      d: description,
      e: emotionId,
      n: name,
      u: userId,
      t: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(function (error) {
      showAlert('Нажалост, измена није успела.')
      console.error('Error writing to database', error);
    });
}


function deletePoint(id) {
  db
    .collection("points")
    .doc(id)
    .delete()
    .then(() => {
    })
    .catch((error) => {
      showAlert('Нажалост, брисање није успело.')
      console.error("Error removing document: ", error);
    });
}
let theUser = null;

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
function showAlert(message) {
  detach("#alert");
  render('#_alert', { message }).attach('body');
}
function initAbout() {
  _('#bgde').addEventListener('click', (e) => {
    toggleClass(_('#about'), 'about-show');
  });
}
ready(() => {
  initAbout();

  initFirebase();

  initLogin();

  fetchPoints();
});
