// Top bar: shows one of three views (Home, Did you know?, My farm) and marks the current link.
// The views stay on the page and are only hidden, so what he typed and his result are never lost.
// The address hash (#home, #did-you-know, #my-farm) records where he is, so the back button works.
import { playHome, showFact } from './intro.js';
import { log } from './log.js';

export const VIEWS = ['home', 'did-you-know', 'my-farm'];

// Shows the named view, hides the others, marks the matching link. Unknown names become 'home'.
export function showView(name, doc = document) {
  const view = VIEWS.includes(name) ? name : 'home';
  VIEWS.forEach((v) => { doc.getElementById(`view-${v}`).hidden = v !== view; });
  doc.querySelectorAll('.nav-link').forEach((link) => {
    if (link.dataset.view === view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  return view;
}

export function initNav() {
  const nav = document.getElementById('nav');
  let introSeen = false; // the bar stays hidden until the first animation has finished

  const revealNav = () => { introSeen = true; nav.hidden = false; };

  function go() {
    const requested = location.hash.slice(1);
    const view = showView(requested);
    log('nav', `showing ${view}`);
    if (view === 'home') {
      playHome(revealNav);
    } else {
      revealNav(); // arriving straight on another view (a refresh) skips the opening
      if (view === 'did-you-know') showFact(false);
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', go);
  document.getElementById('intro-close').addEventListener('click', () => { location.hash = '#my-farm'; });
  document.getElementById('dyk-another').addEventListener('click', () => showFact(true));
  go();
}
