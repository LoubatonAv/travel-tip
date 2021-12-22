export const mapService = {
  initMap,
  addMarker,
  panTo,
  search,
  remove,
};

import { locService } from './loc.service.js';
import { storageService } from './storage.service.js';

const MARKER_KEY = 'markersDB';
const PLACE_KEY = 'placesDB';

let gMarkers = storageService.load(MARKER_KEY) || [];

var gMap;

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
      locService.getLocs().then(locService.setLoc(place, event.latLng));
      locService.getLocs().then((locs) => {
        storageService.save(PLACE_KEY, locs);
      });
      addMarker(event.latLng);
      const marker = event.latLng;

      gMarkers.push(marker);
      storageService.save(MARKER_KEY, gMarkers);
    });
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });

  return marker;
}

function remove(id) {
  const getPlaceIdx = locService.getLocs().then((location) => {
    location.findIndex(function (locationIdx) {
      return id === locationIdx.id;
    });
    location.splice(getPlaceIdx, 1);
    gMarkers.splice(getPlaceIdx, 1);
  });

  locService.getLocs().then((locs) => {
    storageService.save(PLACE_KEY, locs);
    storageService.save(MARKER_KEY, gMarkers);
    initMap();
  });

  onGetLocs();
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  console.log('lat,lng:', lat, lng);
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

function search(address) {
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyC8CzUmPOZfq9TQFfsRlL9fLhWL2mmTIF8`
    )
    .then((res) => res.data.results[0].geometry.location)
    .then((res) => {
      panTo(res.lat, res.lng);
    });
}
