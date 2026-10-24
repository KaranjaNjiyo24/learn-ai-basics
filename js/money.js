// Turns the expected harvest and his optional prices into expected income.
// All three money inputs are optional: blank means "skip that line", never an error.
import { log } from './log.js';

const round0 = (n) => Math.round(n);
export const formatMoney = (n) => `Ksh ${round0(n).toLocaleString('en-US')}`;

// Blank -> null (skipped). A number below zero, or something that is not a number -> { invalid: true }.
function readAmount(text, allowZero) {
  const trimmed = String(text ?? '').trim();
  if (trimmed === '') return { value: null };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0 || (n === 0 && !allowZero)) return { value: null, invalid: true };
  return { value: n };
}

// inputs: { newPrice, lastPrice, lastSpending } as typed text.
// Returns { problems: [...], lines: [...] }; each line is one plain sentence for the result screen.
export function money(inputs, r) {
  const newPrice = readAmount(inputs.newPrice, false);
  const lastPrice = readAmount(inputs.lastPrice, false);
  const spending = readAmount(inputs.lastSpending, true);

  const problems = [];
  if (newPrice.invalid) problems.push('newPrice');
  if (lastPrice.invalid) problems.push('lastPrice');
  if (spending.invalid) problems.push('lastSpending');

  const lines = [];
  if (newPrice.value !== null) {
    const low = r.lowTotal * newPrice.value;
    const high = r.highTotal * newPrice.value;
    lines.push(`Expected income: about ${formatMoney(low)} to ${formatMoney(high)} ` +
      `(${r.lowTotal} to ${r.highTotal} tonnes at ${formatMoney(newPrice.value)} per tonne).`);

    if (lastPrice.value !== null) {
      const change = newPrice.value - lastPrice.value;
      const percent = Math.round(Math.abs(change) / lastPrice.value * 1000) / 10;
      if (change === 0) {
        lines.push(`The new price is the same as last season's ${formatMoney(lastPrice.value)} per tonne.`);
      } else {
        lines.push(`The new price is ${percent}% ${change > 0 ? 'higher' : 'lower'} than last season's ` +
          `${formatMoney(lastPrice.value)} per tonne.`);
      }
    }
    if (spending.value !== null) {
      lines.push(`Last year you spent ${formatMoney(spending.value)}. ` +
        `Next to that, expected income is ${formatMoney(low)} to ${formatMoney(high)}.`);
    }
  } else if (lastPrice.value !== null || spending.value !== null) {
    lines.push('Add the new season price per tonne to see your expected income.');
  }

  log('money', 'calculated', { problems, lines });
  return { problems, lines };
}
