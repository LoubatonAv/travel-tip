import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.onRemove = onRemove;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    const strHtmls = locs.map((place) => {
      console.log('place:', place);

      return `<div>
      <p>${place.name}</p>
      <button onclick="onRemove('${place.id}')">Remove</button>
      <button onclick="onPanTo('${place.latlng.lat}','${place.latlng.lng}')">Go to</button>
      </div>`;
    });
    document.querySelector('.locs').innerHTML = strHtmls.join('');
  });
}

function onRemove(id) {
  const getPlaceIdx = locService.getLocs().then((location) => {
    location.findIndex(function (locationIdx) {
      return id === locationIdx.id;
    });
    location.splice(getPlaceIdx, 1);
  });
  onGetLocs();
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function onPanTo(lat, lng) {
  console.log('Panning the Map');
  mapService.panTo(lat, lng);
}

function onSearch(el) {
  mapService.search(el.value);
}
