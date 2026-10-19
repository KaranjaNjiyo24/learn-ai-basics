// Writes short technical messages to the browser console (F12 > Console).
// The farmer sees friendly messages on screen; the technical detail goes here.

function stamp() {
  return new Date().toISOString().slice(11, 19);
}

export function log(step, message, data) {
  if (data === undefined) console.log(`[${stamp()}] ${step}: ${message}`);
  else console.log(`[${stamp()}] ${step}: ${message}`, data);
}

export function logError(step, message, error) {
  console.error(`[${stamp()}] ${step}: ${message}`, error ?? '');
}
