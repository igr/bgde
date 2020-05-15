
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
