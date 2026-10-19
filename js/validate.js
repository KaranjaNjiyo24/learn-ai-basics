// Checks each form field. Returns { status, message } per field.
//   ok       - fine
//   missing  - left blank
//   invalid  - impossible value; must be corrected
//   unusual  - possible but worth a "are you sure?"
import { limits } from '../data/reference-data.js';

const ok = { status: 'ok', message: '' };
const missing = (label) => ({ status: 'missing', message: `Please fill in ${label}.` });

function numberField(raw, label, check) {
  if (raw === '' || raw === null || raw === undefined) return missing(label);
  const value = Number(raw);
  if (Number.isNaN(value)) return { status: 'invalid', message: `${label} needs to be a number.` };
  return check(value);
}

export function validateAcres(raw) {
  return numberField(raw, 'your acres', (v) => {
    if (v <= limits.acres.invalidBelow) return { status: 'invalid', message: 'Acres needs to be more than zero.' };
    if (v > limits.acres.unusualAbove) return { status: 'unusual', message: 'That is a lot of acres. Are you sure it is correct?' };
    return ok;
  });
}

export function validatePh(raw) {
  return numberField(raw, 'the soil pH', (v) => {
    if (v < limits.ph.invalidBelow || v > limits.ph.invalidAbove)
      return { status: 'invalid', message: 'Soil pH is a number from 0 to 14. Please check your soil report.' };
    if (v < limits.ph.unusualBelow || v > limits.ph.unusualAbove)
      return { status: 'unusual', message: 'That pH looks unusual. Are you sure it is correct?' };
    return ok;
  });
}

export function validateNutrient(raw, label) {
  return numberField(raw, label, (v) => {
    if (v < limits.nutrient.invalidBelow) return { status: 'invalid', message: `${label} cannot be negative.` };
    if (v > limits.nutrient.unusualAbove) return { status: 'unusual', message: `${label} looks very high. Are you sure it is correct?` };
    return ok;
  });
}

export function validateVariety(raw) {
  return String(raw ?? '').trim() === '' ? missing('your cane variety') : ok;
}

export function validatePlace(raw) {
  return String(raw ?? '').trim() === '' ? missing('where your farm is') : ok;
}

export function validatePlantingDate(raw, today = new Date()) {
  if (!raw) return missing('the planting date');
  const planted = new Date(raw);
  if (Number.isNaN(planted.getTime())) return { status: 'invalid', message: 'Please pick a valid planting date.' };
  const ageDays = (today - planted) / 86400000;
  if (ageDays < 0) return { status: 'invalid', message: 'The planting date cannot be in the future.' };
  if (ageDays > limits.plantingAgeDays.unusualAbove)
    return { status: 'unusual', message: 'That planting date is a long time ago. Are you sure it is correct?' };
  return ok;
}

export function validateAll(values, today = new Date()) {
  return {
    acres: validateAcres(values.acres),
    ph: validatePh(values.ph),
    n: validateNutrient(values.n, 'the nitrogen value'),
    p: validateNutrient(values.p, 'the phosphorus value'),
    k: validateNutrient(values.k, 'the potassium value'),
    variety: validateVariety(values.variety),
    plantingDate: validatePlantingDate(values.plantingDate, today),
    place: validatePlace(values.place),
  };
}
