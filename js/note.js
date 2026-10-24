// Writes the short planning note under the estimate from the estimate's own numbers.
// Plain sentence templates, filled in by rules (not AI-written).

const NAMES = { ph: 'soil pH', n: 'nitrogen', p: 'phosphorus', k: 'potassium', rain: 'rainfall so far' };

// The input pulling the estimate down the most, or null if nothing is below 1.
function biggestDrag(factors) {
  const [key, value] = Object.entries(factors).sort((a, b) => a[1] - b[1])[0];
  return value < 1 ? NAMES[key] : null;
}

export function buildNote(r, acres) {
  const sentences = [
    `Plan your money around the lower figure, about ${r.lowTotal} tonnes from your ${acres} acres, ` +
    `and your cutters and transport around the higher figure, about ${r.highTotal} tonnes.`,
  ];
  const drag = biggestDrag(r.factors);
  if (drag) {
    sentences.push(`Your ${drag} is holding the estimate back the most, so it is worth looking at.`);
  }
  if (!r.isLive) {
    sentences.push('This used typical weather, so the range is wider. Try again later for a tighter range.');
  }
  return sentences.join(' ');
}
