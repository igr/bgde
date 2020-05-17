let marker;

function initMapMarker() {
  const infowindow = new google.maps.InfoWindow({
    pixelOffset:new google.maps.Size(0, -10),
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
      "<a href='#' class='star' onclick='addNewPoint" + e.latLng + "; return false;'>Додај ово место...</a>")
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
