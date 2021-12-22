export const locService = {
  getLocs,
  setLoc,
};

import { utils } from './utils.js';
import { storageService } from './storage.service.js';

const locs = storageService.load('placesDB') || [];

function setLoc(name, latlng) {
  const loc = {
    name,
    latlng,
    id: utils.makeId(),
  };
  locs.push(loc);
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 1);
  });
}
