// Gets rainfall and temperature since planting from Open-Meteo, or typical values if that fails.
// Docs: https://open-meteo.com/en/docs/historical-weather-api
import { typicalWeather } from '../data/reference-data.js';
import { log, logError } from './log.js';

const WEATHER_URL = 'https://archive-api.open-meteo.com/v1/archive';

const isoDate = (d) => d.toISOString().slice(0, 10);

export function cropAgeDays(plantingDate, today = new Date()) {
  return Math.max(1, Math.floor((today - new Date(plantingDate)) / 86400000));
}

// Live weather: { rainfallTotalMm, avgTempC, ageDays, isLive: true }. Throws if it cannot be fetched.
export async function getSeasonWeather({ latitude, longitude, plantingDate }, today = new Date(), fetchFn = fetch) {
  const url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&start_date=${plantingDate}&end_date=${isoDate(today)}` +
    '&daily=precipitation_sum,temperature_2m_mean&timezone=auto';
  log('weather', 'requesting weather', url);
  let data;
  try {
    const response = await fetchFn(url);
    if (!response.ok) throw new Error(`weather service replied ${response.status}`);
    data = await response.json();
  } catch (error) {
    logError('weather', 'weather request failed', error);
    throw error;
  }

  const rain = (data.daily?.precipitation_sum ?? []).filter((v) => v !== null);
  const temps = (data.daily?.temperature_2m_mean ?? []).filter((v) => v !== null);
  if (rain.length === 0 || temps.length === 0) {
    const error = new Error('weather service returned no daily values');
    logError('weather', 'empty weather reply', error);
    throw error;
  }
  const weather = {
    rainfallTotalMm: Math.round(rain.reduce((a, b) => a + b, 0)),
    avgTempC: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
    ageDays: cropAgeDays(plantingDate, today),
    isLive: true,
  };
  log('weather', 'season weather', weather);
  return weather;
}

// Typical conditions for a crop of this age; used when live weather is unavailable.
export function typicalSeasonWeather(plantingDate, today = new Date()) {
  const ageDays = cropAgeDays(plantingDate, today);
  const weather = {
    rainfallTotalMm: Math.round(typicalWeather.rainfallPerDayMm * ageDays),
    avgTempC: typicalWeather.avgTempC,
    ageDays,
    isLive: false,
  };
  log('weather', 'using typical conditions', weather);
  return weather;
}
