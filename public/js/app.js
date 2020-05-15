
const iconbase = '/gfx';

const MAX_EMOTIONS = 4;
let emotion = 1;

let theUser = null;

// firebase
let db;
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
  controlUI.title = 'Tip mape';
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
    zoom: 10,
    minZoom: 10,
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
        east: 20.50,
        west: 20.38,
        north: 44.835,
        south: 44.76,
      },
    },
  });

  // mapTypeSwitchControl

  const mapTypeSwitchControl = document.createElement('div');
  const centerControl = new createMapSwitchTypeControl(mapTypeSwitchControl, map);

  mapTypeSwitchControl.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapTypeSwitchControl);

  // info window

  const infowindow = new google.maps.InfoWindow;
  const marker = new google.maps.Marker({
    icon: iconbase + '/map-star.png',
    draggable: true,
    map
  });

  // listeners

  map.addListener('rightclick', (e) => {
    marker.setMap(map);
    marker.setPosition(e.latLng);
    infowindow.setContent(
      "<a href='#' onclick='addNewPoint" + e.latLng + "; return false;'>Moje mesto...</a>")
    ;
    infowindow.open(map, marker);
  });
  google.maps.event.addListener(infowindow,'closeclick', () => {
    marker.setMap(null);
  });
}
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
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>',
  };

  // Initialize the FirebaseUI Widget using Firebase
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  firebase.auth().onAuthStateChanged(function(user) {
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
          const data = change.doc.data();
          const marker = new google.maps.Marker({
            icon: iconbase + `/em-${data.e}.png`,
            position: {
              lat: data.x.latitude,
              lng: data.x.longitude,
            },
            map
          });

          marker.addListener('mouseover', () => {
            showPointInfo(map, data.n, data.x, data.e);
          });

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

function showPointInfo(map, name, x, e) {
  popup = new Popup(
    new google.maps.LatLng(x.latitude, x.longitude),
    name,
    e
  );
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
  function Popup(position, contentText, emotion) {
    this.position = position;

    const content = document.createElement('div');
    content.classList.add('popup-bubble');

    const img = document.createElement('img');
    img.src = iconbase + `/em-${emotion}.png`;
    content.appendChild(img);
    const span = document.createElement('span')
    span.appendChild(document.createTextNode(contentText));
    content.appendChild(span);
    // close it when mouse is out
    content.addEventListener('mouseout', () => { closePointInfo(); });


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
  };

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
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
ready(() => {
  initFirebase();

  initLogin();

  initAddNewPointDialog();

  initModalDialog();

  fetchPoints();

});
