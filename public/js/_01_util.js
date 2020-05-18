function navigate(lat, lng){
  if( (navigator.platform.indexOf("iPhone") != -1)
    || (navigator.platform.indexOf("iPod") != -1)
    || (navigator.platform.indexOf("iPad") != -1))
    window.open(`maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`);
  else
    window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`);
}
