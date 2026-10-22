---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. You can fill in the farm form and see a yield estimate range**
  Becomes usable: A page served locally where he types acres, pH, N, P, K, variety, and planting date, taps the estimate button, and sees low-to-high tonnes per acre plus the total, labeled as a sample-data estimate. Weather uses typical-condition values for now; unusual or blank entries show the friendly check.
  Why now: This is the unique kernel, an estimate from his own inputs, and it proves the whole path end to end (scaffold, form, checks, calculation, result). Every later slice improves it.
  PRD ref: `prd.md > Farm details`, `prd.md > Yield estimate`, `prd.md > States and Boundaries`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components > Farm details form and checks`, `spec.md > Components > Yield estimate`, `spec.md > Components > Logging`, `spec.md > Data Model`, `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Scaffold the files from the spec's file structure; add `styles.css` with the exact colors, serif type, and square corners; build the form and result containers in `index.html`; add `log.js`, `validate.js`, `estimate.js`, `app.js`, and a clearly labeled SAMPLE `data/reference-data.js` (including typical-season weather).
  Verify (mechanical): Run `estimate.js` with sample inputs in Node and confirm low < high and that changing one input (more acres, a very low pH) changes the result in the expected direction; start `python3 -m http.server 8000` and confirm `index.html`, CSS, and JS files all load with status 200 and no module errors.
  Learner check: Open `http://localhost:8000`, fill the form, tap the estimate, and say whether it looks and feels the way you pictured. Try typing a pH of 40 and see what message appears.
  Commit: `Add farm form and sample-data yield estimate`

- [x] **2. The estimate uses real weather for a place you type**
  Becomes usable: He types a place name, the app finds its coordinates, fetches rainfall and temperature since the planting date, and the estimate responds to the live weather. If the lookup fails he sees "try again" and can continue on typical conditions, with a wider range.
  Why now: The weather request is the one outside dependency and the biggest unknown, so it goes right after the kernel exists. It also lets you see the raw reply and the console log.
  PRD ref: `prd.md > Location and weather`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > Location`, `spec.md > Components > Weather`, `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes`
  Build: Verify the Open-Meteo URLs and response shapes first; add the place-name lookup in `location.js` and the request in `weather.js` (rainfall total, average temperature, `isLive`); wire both into `app.js`; add the retry and typical-conditions behavior with console logging.
  Verify (mechanical): Call the lookup and weather functions in Node for a real place and planting date and confirm sensible rainfall and temperature values; simulate a failure (bad URL) and confirm `isLive` is false with the wider range; confirm an unknown place name gives the "try a nearby town" message.
  Learner check: Type a place you know and a planting date, and see the weather appear and the estimate change. Turn off your internet and see the "try again" message.
  Commit: `Add place lookup, live weather, and weather fallback`

- [x] **3. "Use my location" asks the browser and fills in the weather**
  Becomes usable: A button asks the browser for the phone's or computer's location; if allowed, the weather and estimate use it. If refused, the typed place field takes over.
  Why now: It completes the location story from the PRD after the typed path already works, so refusing never leaves him stuck.
  PRD ref: `prd.md > Location and weather`
  Spec ref: `spec.md > Components > Location`, `spec.md > Important Failure Modes`
  Build: Add the browser Geolocation request to `location.js` with a clear refused/unavailable path that reveals the typed field; wire the button into `app.js`; log each outcome.
  Verify (mechanical): Confirm the code path for allowed, denied, and unavailable returns the expected result using a stubbed geolocation in Node; confirm the page loads without console errors.
  Learner check: Tap "Use my location", watch the browser's own prompt, allow it, and see the weather appear. Then refuse it (or reset the permission) and confirm the typed field appears.
  Commit: `Add browser location with typed fallback`

- [ ] **4. The result includes a plain planning note**
  Becomes usable: Under every estimate, a short sentence or two about planning money and labor that refers to the numbers shown.
  Why now: It finishes the result screen the PRD describes, and it is cheap once the estimate exists.
  PRD ref: `prd.md > Planning note`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Components > Planning note`
  Build: Add `note.js` with a few sentence templates filled from the estimate, and show it on the result screen.
  Verify (mechanical): Run `note.js` in Node with several estimates (including a wide range) and confirm the text includes the actual numbers and never prints empty or undefined values.
  Learner check: Run an estimate and read the note. Say whether it is useful to your friend, and what you would change in the wording.
  Commit: `Add planning note to result`

- [ ] **5. The app opens with the sugarcane animation and a verified fact**
  Becomes usable: Opening the page plays the cane-growth animation, shows one verified "Did you know?" fact, and then leads to the form.
  Why now: It is the finishing identity of the app. It also needs your verified facts, so it comes late enough for you to prepare them.
  PRD ref: `prd.md > Opening animation and "Did you know?"`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components > Opening animation and fact pop-up`, `spec.md > Look and Feel`
  Build: Add `intro.js`, the CSS/SVG growth animation in `#008000`, and `data/facts.js` using only the facts and sources you provide; the pop-up closes to the form.
  Verify (mechanical): Confirm the facts file has a source for every fact; load the page and confirm the intro container appears, the pop-up closes, and the form is reachable with no console errors.
  Learner check: Open the app fresh. Watch the animation, read the fact, close it, and say whether the opening feels the way you pictured.
  Commit: `Add sugarcane intro animation and verified fact pop-up`

- [ ] **6. Optional money section shows expected income**
  Becomes usable: With a new-season price (and optionally last season's price and last year's spending), the result also shows expected income as a range and the price comparison.
  Why now: The PRD put it last and first to drop; the yield estimate must be working and approved first.
  PRD ref: `prd.md > Money (optional, built last)`
  Spec ref: `spec.md > Components > Money (built last)`
  Build: Add the collapsed money section to the form, `money.js`, and the extra lines on the result screen; leaving it blank changes nothing.
  Verify (mechanical): Run `money.js` in Node with known numbers and confirm income range and comparison; confirm the page result is unchanged when the section is blank.
  Learner check: Enter a price per tonne and last season's price, and check the income and comparison make sense to you.
  Commit: `Add optional income and price comparison`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2, when the estimate responds to real weather
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: not started
Route and stops: not started
Edit outcome: not started
Reflection: not started
Activity mode: not started

## Revisions

- Impossible values (a pH of 40, zero or negative acres) now ask the farmer to correct them instead of offering "are you sure?" — the build found that an estimate calculated from an impossible number would be meaningless. Merely unusual values (a pH of 3, 800 acres) still get the friendly "are you sure?" with confirm or fix, as the PRD describes.
- Rainfall is compared with what the crop needs for its age so far, not a whole season — the build found that comparing rain since planting with a full season's need would wrongly mark every young crop as "too dry". The estimate now takes the crop's age in days along with the weather.
