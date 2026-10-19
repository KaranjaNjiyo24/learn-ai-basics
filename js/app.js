// Connects the steps in order:
// read the form -> check it -> find the place -> get the weather -> estimate -> show the result.
import { validateAll } from './validate.js';
import { estimate } from './estimate.js';
import { findPlace, describePlace } from './location.js';
import { getSeasonWeather, typicalSeasonWeather } from './weather.js';
import { log } from './log.js';
import { SAMPLE_LABEL } from '../data/reference-data.js';

const FIELDS = ['acres', 'variety', 'plantingDate', 'place', 'ph', 'n', 'p', 'k'];
const $ = (id) => document.getElementById(id);

let pendingUnusual = null; // values waiting on "Yes it is correct" / "Let me fix it"
let pendingWeather = null; // values waiting on "Try again" / "Continue with typical conditions"

function readForm() {
  const values = {};
  FIELDS.forEach((f) => { values[f] = $(f).value; });
  return values;
}

function showMessages(checks) {
  FIELDS.forEach((f) => {
    $(`${f}-msg`).textContent = checks[f].status === 'ok' ? '' : checks[f].message;
  });
}

function hideBoxes() {
  $('confirm-box').hidden = true;
  $('weather-box').hidden = true;
  pendingUnusual = null;
  pendingWeather = null;
}

function setStatus(text) {
  $('status').textContent = text;
}

function showResult(values, weather, placeText) {
  const r = estimate(values, weather);

  $('result-per-acre').textContent = `${r.lowPerAcre} to ${r.highPerAcre} tonnes per acre`;
  $('result-total').textContent =
    `For your ${values.acres} acres: about ${r.lowTotal} to ${r.highTotal} tonnes in total.`;
  $('result-label').textContent = r.isLive
    ? `This is an estimate based on ${SAMPLE_LABEL}, adjusted for the real weather near ${placeText} since you planted.`
    : `This is an estimate based on ${SAMPLE_LABEL}, and on typical conditions, not live weather, so the range is wider.`;

  const f = r.factors;
  $('result-detail').innerHTML = `
    <p>We start from a range of ${r.baselineLow} to ${r.baselineHigh} tonnes per acre
    (${r.varietyFound ? 'for your variety' : 'a general range: your variety is not in the sample table yet'}),
    then adjust it for each thing you told us. A factor of 1 means no change.</p>
    <p>Weather over the ${weather.ageDays} days since planting${r.isLive ? ` near ${placeText}` : ' (typical values)'}:
    about ${weather.rainfallTotalMm} mm of rain, average temperature ${weather.avgTempC} °C.</p>
    <table>
      <tr><td>Soil pH</td><td>${f.ph}</td></tr>
      <tr><td>Nitrogen</td><td>${f.n}</td></tr>
      <tr><td>Phosphorus</td><td>${f.p}</td></tr>
      <tr><td>Potassium</td><td>${f.k}</td></tr>
      <tr><td>Rainfall so far</td><td>${f.rain}</td></tr>
      <tr><td><b>All together</b></td><td><b>${r.combined}</b></td></tr>
    </table>`;
  $('result').hidden = false;
  $('result').scrollIntoView({ behavior: 'smooth' });
}

function offerWeatherFallback(values) {
  pendingWeather = values;
  $('weather-text').textContent =
    "We couldn't get the weather right now. You can try again, or continue with typical conditions (the range will be wider).";
  $('weather-box').hidden = false;
  setStatus('');
}

async function runEstimate(values) {
  $('result').hidden = true;
  setStatus('Finding your farm and checking the weather…');
  let place;
  try {
    place = await findPlace(values.place);
  } catch {
    offerWeatherFallback(values);
    return;
  }
  if (!place) {
    setStatus('');
    $('place-msg').textContent = "We couldn't find that place. Try a nearby town.";
    return;
  }
  const placeText = describePlace(place);
  $('place-msg').textContent = `Using ${placeText}.`;

  let weather;
  try {
    weather = await getSeasonWeather({
      latitude: place.latitude,
      longitude: place.longitude,
      plantingDate: values.plantingDate,
    });
  } catch {
    offerWeatherFallback(values);
    return;
  }
  setStatus('');
  showResult(values, weather, placeText);
}

function handleSubmit(event) {
  event.preventDefault();
  hideBoxes();
  const values = readForm();
  const checks = validateAll(values);
  log('form', 'checked fields', checks);
  showMessages(checks);

  const statuses = FIELDS.map((f) => checks[f].status);
  if (statuses.includes('missing') || statuses.includes('invalid')) {
    $('result').hidden = true;
    return;
  }

  const unusual = FIELDS.filter((f) => checks[f].status === 'unusual');
  if (unusual.length > 0) {
    pendingUnusual = values;
    $('confirm-text').textContent = unusual.map((f) => checks[f].message).join(' ');
    $('confirm-box').hidden = false;
    $('result').hidden = true;
    return;
  }
  runEstimate(values);
}

$('farm-form').addEventListener('submit', handleSubmit);
$('confirm-yes').addEventListener('click', () => {
  const values = pendingUnusual;
  hideBoxes();
  if (values) runEstimate(values);
});
$('confirm-fix').addEventListener('click', hideBoxes);
$('weather-retry').addEventListener('click', () => {
  const values = pendingWeather;
  hideBoxes();
  if (values) runEstimate(values);
});
$('weather-continue').addEventListener('click', () => {
  const values = pendingWeather;
  hideBoxes();
  if (values) showResult(values, typicalSeasonWeather(values.plantingDate), values.place);
});

log('app', 'loaded');
