// Opening: the cane-growth animation plays, then one fact (picked at random) appears with a close button.
import { facts } from '../data/facts.js';
import { log } from './log.js';

const GROW_MS = 3200; // matches the CSS animation length

export function pickFact(list = facts, random = Math.random) {
  return list[Math.floor(random() * list.length)];
}

export function playIntro() {
  const root = document.getElementById('intro');
  const factBox = document.getElementById('intro-fact');
  const close = () => {
    root.hidden = true;
    log('intro', 'closed, form is showing');
  };
  document.getElementById('intro-close').addEventListener('click', close);

  const fact = pickFact();
  document.getElementById('intro-text').textContent = fact.text;
  document.getElementById('intro-source').textContent = `Source: ${fact.source}`;

  root.hidden = false;
  log('intro', 'animation started');
  setTimeout(() => {
    factBox.hidden = false;
    document.getElementById('intro-close').focus();
    log('intro', 'fact shown', fact.text);
  }, GROW_MS);
}
