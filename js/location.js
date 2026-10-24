// Turns a typed place name into coordinates using the Open-Meteo geocoding service.
// Docs: https://open-meteo.com/en/docs/geocoding-api
import { log, logError } from './log.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Returns { name, region, country, latitude, longitude }, or null if no place matches.
// Throws if the request itself fails (no signal, service down).
export async function findPlace(name, fetchFn = fetch) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name.trim())}&count=1&language=en&format=json`;
  log('location', 'looking up place', name);
  let response;
  try {
    response = await fetchFn(url);
    if (!response.ok) throw new Error(`geocoding service replied ${response.status}`);
  } catch (error) {
    logError('location', 'place lookup failed', error);
    throw error;
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    log('location', 'no place matched', name);
    return null;
  }
  const r = data.results[0];
  const place = {
    name: r.name,
    region: r.admin1 ?? '',
    country: r.country ?? '',
    latitude: r.latitude,
    longitude: r.longitude,
  };
  log('location', 'found place', place);
  return place;
}

export function describePlace(place) {
  return [place.name, place.region, place.country].filter(Boolean).join(', ');
}

// Asks the browser for the device's position. The browser shows its own "Allow location?" prompt.
// Resolves { latitude, longitude }. Rejects with an Error whose .reason is
// 'denied', 'unavailable', 'timeout', or 'unsupported'.
export function getBrowserLocation(geo = globalThis.navigator?.geolocation) {
  return new Promise((resolve, reject) => {
    const fail = (reason, detail) => {
      logError('location', `browser location failed: ${reason}`, detail);
      const error = new Error(`browser location ${reason}`);
      error.reason = reason;
      reject(error);
    };
    if (!geo) {
      fail('unsupported');
      return;
    }
    log('location', 'asking the browser for the device location');
    geo.getCurrentPosition(
      (position) => {
        const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        log('location', 'browser gave coordinates', coords);
        resolve(coords);
      },
      (err) => fail({ 1: 'denied', 2: 'unavailable', 3: 'timeout' }[err.code] ?? 'unavailable', err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
}

// Turns coordinates into a readable place name ("Kisumu, Kenya") using BigDataCloud's
// browser-side reverse geocoding. Returns null if it has no name for that spot.
// Throws if the request fails. Docs: https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export async function reverseGeocode({ latitude, longitude }, fetchFn = fetch) {
  const url = `${REVERSE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  log('location', 'looking up a name for the coordinates');
  let data;
  try {
    const response = await fetchFn(url);
    if (!response.ok) throw new Error(`reverse geocoding service replied ${response.status}`);
    data = await response.json();
  } catch (error) {
    logError('location', 'reverse lookup failed', error);
    throw error;
  }
  const parts = [data.locality || data.city, data.principalSubdivision, data.countryName].filter(Boolean);
  const name = [...new Set(parts)].join(', ');
  log('location', name ? 'coordinates are in' : 'no name for these coordinates', name);
  return name || null;
}
