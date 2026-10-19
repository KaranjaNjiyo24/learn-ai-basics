// Turns his inputs plus the season's weather into a low-to-high yield range.
// Steps: baseline range -> one factor per input -> multiply the factors -> apply to baseline
//        -> widen the range if the weather was not live.
import {
  baseline, varieties, phBands, nutrientBands, rainfall, widenWhenNotLive,
} from '../data/reference-data.js';
import { log } from './log.js';

function phFactor(ph) {
  return phBands.find((b) => ph >= b.min && ph <= b.max).factor;
}

function nutrientFactor(kind, value) {
  return nutrientBands[kind].find((b) => value < b.below).factor;
}

function rainFactor(totalMm) {
  const ratio = totalMm / rainfall.neededMm;
  return rainfall.bands.find((b) => ratio < b.ratioBelow).factor;
}

const round1 = (n) => Math.round(n * 10) / 10;

export function estimate(inputs, weather) {
  const key = String(inputs.variety).trim().toLowerCase();
  const varietyFound = Object.prototype.hasOwnProperty.call(varieties, key);
  const base = varietyFound ? varieties[key] : baseline;

  const factors = {
    ph: phFactor(Number(inputs.ph)),
    n: nutrientFactor('n', Number(inputs.n)),
    p: nutrientFactor('p', Number(inputs.p)),
    k: nutrientFactor('k', Number(inputs.k)),
    rain: rainFactor(weather.rainfallTotalMm),
  };
  const combined = Object.values(factors).reduce((a, b) => a * b, 1);

  let low = base.low * combined;
  let high = base.high * combined;
  if (!weather.isLive) {
    low *= widenWhenNotLive.low;
    high *= widenWhenNotLive.high;
  }

  const acres = Number(inputs.acres);
  const result = {
    baselineLow: base.low,
    baselineHigh: base.high,
    varietyFound,
    factors,
    combined: Math.round(combined * 1000) / 1000,
    isLive: weather.isLive,
    lowPerAcre: round1(low),
    highPerAcre: round1(high),
    lowTotal: round1(low * acres),
    highTotal: round1(high * acres),
  };
  log('estimate', 'calculated range', result);
  return result;
}
