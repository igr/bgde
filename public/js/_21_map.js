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
