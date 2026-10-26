// SAMPLE DATA - illustrative placeholders, NOT real harvest records or published figures.
// Every number in this file is a stand-in so the app can run end to end.
// Replace with sourced figures (and write the source next to each) before anyone relies on it.

export const SAMPLE_LABEL = 'sample reference data, not real harvest records';

// Baseline tonnes of cane per acre when conditions are good.
export const baseline = { low: 20, high: 35 };

// Variety-specific baselines. Empty for now: the general range is used and the app says so.
// Shape when filled: { 'variety name in lowercase': { low: 0, high: 0 } }
export const varieties = {};

// Each factor multiplies the baseline. 1 means no change.
// pH bands: first matching band wins.
export const phBands = [
  { min: 6.0, max: 7.5, factor: 1.0 },
  { min: 5.5, max: 8.0, factor: 0.92 },
  { min: 0, max: 14, factor: 0.8 },
];

// Nutrient levels, assumed to be in mg/kg (ppm). CHECK what unit the soil report uses.
export const nutrientBands = {
  n: [{ below: 20, factor: 0.9 }, { below: Infinity, factor: 1.0 }],
  p: [{ below: 15, factor: 0.92 }, { below: Infinity, factor: 1.0 }],
  k: [{ below: 100, factor: 0.92 }, { below: Infinity, factor: 1.0 }],
};

// Rainfall since planting, compared with what the crop needs for its age so far.
// neededMm is for the whole crop cycle of seasonDays; a younger crop needs a proportional share.
// Sugarcane here matures in 18 to 24 months, so the cycle is the 21-month midpoint (about 640 days).
// neededMm keeps the same daily rate as a 1200 mm year (about 3.3 mm per day).
export const maturity = { minMonths: 18, maxMonths: 24, cycleDays: 640 };
export const rainfall = {
  neededMm: 2100,
  seasonDays: maturity.cycleDays,
  bands: [
    { ratioBelow: 0.6, factor: 0.8 },
    { ratioBelow: 0.8, factor: 0.9 },
    { ratioBelow: 1.3, factor: 1.0 },
    { ratioBelow: Infinity, factor: 0.95 },
  ],
};

// Used when live weather is unavailable: typical conditions, per day since planting.
export const typicalWeather = { rainfallPerDayMm: 2100 / 640, avgTempC: 24 };

// Extra spread added when the weather is not live.
export const widenWhenNotLive = { low: 0.9, high: 1.1 };

// Plausible ranges used by the form checks. "invalid" means impossible; "unusual" means worth double-checking.
export const limits = {
  acres: { invalidBelow: 0, unusualAbove: 500 },
  ph: { invalidBelow: 0, invalidAbove: 14, unusualBelow: 4, unusualAbove: 9 },
  nutrient: { invalidBelow: 0, unusualAbove: 1000 },
  plantingAgeDays: { unusualAbove: 800 },
};
