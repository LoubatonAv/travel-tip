export const mapService = {
  initMap,
  addMarker,
  panTo,
  search
};

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi().then(() => {
    console.log('google available');
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    console.log('Map!', gMap);
    gMap.addListener('click', (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();

      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infoWindow.open(gMap);
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

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
  addMarker({lat,lng});
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyAo38Eu3J2sctb8NIVS4KVUJx0eZDuHfp0';
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
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyC8CzUmPOZfq9TQFfsRlL9fLhWL2mmTIF8`)
    .then(res => res.data.results[0].geometry.location)
    .then(res => {
        panTo(res.lat,res.lng);
    });
    

    
}