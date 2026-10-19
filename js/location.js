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
