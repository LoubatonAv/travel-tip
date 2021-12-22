export const locService = {
  getLocs,
};

import { utils } from './utils.js';

const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
];

`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyC8CzUmPOZfq9TQFfsRlL9fLhWL2mmTIF8`

setLoc();
function setLoc(id, name) {
  const loc = {
    id: utils.makeId(),
  };
  console.log(loc);
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}
