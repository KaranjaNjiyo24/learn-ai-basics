// Home view: the cane-growth animation plays, then one fact (picked at random) appears with a button.
// Only the fact text is shown on screen; each fact's source stays recorded in data/facts.js.
// Also picks the fact for the "Did you know?" view.
import { facts } from '../data/facts.js';
import { log } from './log.js';

const GROW_MS = 3200; // matches the CSS animation length

// A random fact; `not` is a fact to avoid, so "Show another fact" always changes it.
export function pickFact(list = facts, random = Math.random, not = null) {
  const choices = list.length > 1 ? list.filter((f) => f !== not) : list;
  return choices[Math.floor(random() * choices.length)];
}

let timer = null;

// Plays the animation from the start. `onFactShown` runs when the fact appears (the nav bar uses it).
export function playHome(onFactShown = () => {}) {
  const home = document.getElementById('view-home');
  const factBox = document.getElementById('intro-fact');
  clearTimeout(timer);
  factBox.hidden = true;

  const fact = pickFact();
  document.getElementById('intro-text').textContent = fact.text;

  home.classList.remove('playing');
  void home.offsetWidth; // forces the browser to restart the CSS animation
  home.classList.add('playing');
  log('intro', 'animation started');
  timer = setTimeout(() => {
    factBox.hidden = false;
    log('intro', 'fact shown', fact.text);
    onFactShown();
  }, GROW_MS);
}

// "Did you know?" view: fills in a fact, and a new one each time `another` is true.
let current = null;
export function showFact(another = false) {
  current = pickFact(facts, Math.random, another ? current : null);
  document.getElementById('dyk-text').textContent = current.text;
  log('facts', 'showing fact', current.text);
}
