export const mapService = {
  initMap,
  addMarker,
  panTo,
};
import { locService } from './loc.service.js';
import { storageService } from './storage.service.js';

var gMap;
const MARKER_KEY = 'markersDB';
let gMarkers = [];
// storageService.load(MARKER_KEY) ||
function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    gMarkers.forEach((marker) => {
      addMarker(marker);
    });
    gMap.addListener('click', (event) => {
      const place = prompt('Enter place name');
      const newPlace = locService.setLoc(place);
      const savedLocations = locService
        .getLocs()
        .then((res) => res.push(newPlace))
        .then(renderPlaces);

      addMarker(event.latLng);
      const marker = event.latLng;
      gMarkers.push(marker);
      storageService.save(MARKER_KEY, gMarkers);
    });
  });
}

function renderPlaces(places) {
  console.log('hi');
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });

  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyBs6tCD8NczXXKGpsVbHPuzCmTuymcyiJA';
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}
