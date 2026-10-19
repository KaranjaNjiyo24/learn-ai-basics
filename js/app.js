// Connects the steps in order: read the form -> check it -> estimate -> show the result.
import { validateAll } from './validate.js';
import { estimate } from './estimate.js';
import { log } from './log.js';
import { typicalWeather, SAMPLE_LABEL } from '../data/reference-data.js';

const FIELDS = ['acres', 'variety', 'plantingDate', 'ph', 'n', 'p', 'k'];
const $ = (id) => document.getElementById(id);

let pendingUnusual = null; // set when we are waiting for "Yes it is correct" / "Let me fix it"

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

function hideConfirm() {
  $('confirm-box').hidden = true;
  pendingUnusual = null;
}

function showResult(values) {
  // Slice 1 uses typical-condition weather. Live weather arrives in slice 2.
  const weather = { ...typicalWeather, isLive: false };
  const r = estimate(values, weather);

  $('result-per-acre').textContent = `${r.lowPerAcre} to ${r.highPerAcre} tonnes per acre`;
  $('result-total').textContent =
    `For your ${values.acres} acres: about ${r.lowTotal} to ${r.highTotal} tonnes in total.`;
  $('result-label').textContent =
    `This is an estimate based on ${SAMPLE_LABEL}` +
    (r.isLive ? '.' : ', and on typical weather, not live weather.');

  const f = r.factors;
  $('result-detail').innerHTML = `
    <p>We start from a range of ${r.baselineLow} to ${r.baselineHigh} tonnes per acre
    (${r.varietyFound ? 'for your variety' : 'a general range: your variety is not in the sample table yet'}),
    then adjust it for each thing you told us. A factor of 1 means no change.</p>
    <table>
      <tr><td>Soil pH</td><td>${f.ph}</td></tr>
      <tr><td>Nitrogen</td><td>${f.n}</td></tr>
      <tr><td>Phosphorus</td><td>${f.p}</td></tr>
      <tr><td>Potassium</td><td>${f.k}</td></tr>
      <tr><td>Rainfall</td><td>${f.rain}</td></tr>
      <tr><td><b>All together</b></td><td><b>${r.combined}</b></td></tr>
    </table>`;
  $('result').hidden = false;
  $('result').scrollIntoView({ behavior: 'smooth' });
}

function handleSubmit(event) {
  event.preventDefault();
  hideConfirm();
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
  showResult(values);
}

$('farm-form').addEventListener('submit', handleSubmit);
$('confirm-yes').addEventListener('click', () => {
  const values = pendingUnusual;
  hideConfirm();
  if (values) showResult(values);
});
$('confirm-fix').addEventListener('click', hideConfirm);

log('app', 'loaded');
