---
doc: spec
status: approved
---

# Shamba Bora — Technical Spec

## How This Works, In Plain Language
Shamba Bora is a small website that runs entirely in the browser. There is no server of our own and no database.

- **The page** shows the opening animation, the "Did you know?" pop-up, the form, and the result.
- **The browser** supplies the date picker, the number keyboard, and the "Allow location?" prompt.
- **A weather service** (Open-Meteo) is the only outside piece. We send it his latitude and longitude and a date range; it replies with rainfall and temperature as structured text (JSON).
- **A reference table** is a small data file of sample sugarcane yield figures and adjustment rules. It is clearly labeled as sample data.
- **The estimate** is a short calculation: start from the table's low-to-high tonnes per acre, nudge it by his pH, nutrients, variety, and the season's rainfall, and show the result as a range.
- **A log** writes short technical messages to the browser's developer console (F12), so errors can be checked while testing. The farmer sees a friendly message instead.

Why this shape: it is the fastest route to a working, good-looking, phone-friendly proof, and every number can be traced to a rule you can read.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Opening.** The page loads. `intro.js` plays the sugarcane animation, then shows one fact picked at random from `data/facts.js` (each with its source). He closes it. (`prd.md > Opening animation and "Did you know?"`)
2. **Form.** He types acres, pH, nitrogen, phosphorus, potassium, cane variety, and picks the planting date. `validate.js` checks each field and shows the friendly "are you sure?" message for blank or unlikely values. (`prd.md > Farm details`)
3. **Location.** He taps "Use my location". The browser shows its prompt; if he allows, it returns latitude and longitude. If he refuses, he types a place name, and the geocoding service turns it into latitude and longitude. (`prd.md > Location and weather`)
4. **Weather.** `weather.js` asks Open-Meteo for daily rainfall and temperature from the planting date to today, then totals the rainfall and averages the temperature. If the request fails, he sees "try again", and can continue with the result marked "typical conditions". (`prd.md > States and Boundaries`)
5. **Estimate.** `estimate.js` takes the reference range for his variety (or the general range), applies the adjustment factors, and produces low and high tonnes per acre and the total for his acres. `note.js` builds the planning note from templates using those numbers. (`prd.md > Yield estimate`, `prd.md > Planning note`)
6. **Result.** The result screen shows the range, the total, the note, and the label "estimate based on sample reference data, not real harvest records". (`prd.md > Screens and Layout`)
7. **Money (last).** If he entered prices, `money.js` shows expected income as a range and compares the new price with last season's. (`prd.md > Money`)

## Stack
- **HTML, CSS, JavaScript (ES modules), no framework, no build step.** Learner-agreed: simplest, fastest to load, easiest to read and explain. Tradeoff accepted: JavaScript instead of the learner's Python.
- **Local server for development and the demo:** `python3 -m http.server 8000` (Python is already installed). Reason: browsers allow location and JavaScript modules only on a web server or `localhost`, not from a double-clicked file.
- **Fonts:** the system's Times New Roman (with Times and generic serif as backups). No font files to load.
- **Weather and place lookup:** Open-Meteo. Docs: https://open-meteo.com/en/docs (forecast), https://open-meteo.com/en/docs/historical-weather-api (past weather), https://open-meteo.com/en/docs/geocoding-api (place names). **Unverified:** I have not checked these in this session. Verify the exact URLs, free-use terms, and response shape first thing in the build.
- **Location:** the browser Geolocation API. Docs: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

## Where It Runs and How Someone Tries It
- Runs locally in a desktop browser (Chrome or Edge recommended). Needs internet for weather.
- Start: in the project folder run `python3 -m http.server 8000`, then open `http://localhost:8000`.
- For the demo video: record the browser showing the opening, the form being filled in, the location step, and the result with its range and note. A phone-width view (browser dev tools "device" mode) shows the phone layout.
- No API keys or accounts needed.
- Submission needs both a short demo video and a public GitHub repository. Deployment is optional. If wanted later, GitHub Pages can serve this static site (decided in `6-ship`).

## Look and Feel
Carried from `prd.md > Look and Feel`; no new questions.
- **Colors (flat, exact, no tints or gradients):** brown `#964B00` for text, borders, and buttons; green `#008000` for the cane animation and the main action; white `#FFFFFF` background. Defined once as CSS variables in `styles.css`.
- **Corners:** square (`border-radius: 0`) everywhere.
- **Type:** Times New Roman serif, prominent headings.
- **Buttons and fields:** modest size, single column, comfortable on a phone.
- **Tone of text:** warm, plain, respectful. Short sentences.
- **Animation:** CSS/SVG only, no animation library. A stalk grows from a shoot to full height in `#008000`.

## Components

### Opening animation and fact pop-up
`intro.js` plays the CSS/SVG growth animation, then shows one fact from `data/facts.js` and a close button. Facts are only those the learner has verified.
PRD ref: `prd.md > Opening animation and "Did you know?"`.

### Farm details form and checks
`index.html` holds the form. `validate.js` returns, per field, "ok", "missing", or "unusual" (outside a plausible range defined in `data/reference-data.js`). Unusual shows "That looks unusual — are you sure?" with confirm or fix.
PRD ref: `prd.md > Farm details`, `prd.md > States and Boundaries`.

### Location
`location.js` asks the browser for coordinates; on refusal or failure it offers a typed place name and looks it up with Open-Meteo geocoding. **This is my recommendation for the PRD's open question, awaiting your agreement:** place name, because it is easier for a farmer than coordinates.
After the browser gives coordinates, `reverseGeocode` asks BigDataCloud for a readable name (for example "Kisumu, Kenya") and the form shows the name together with the coordinates. If that lookup fails, the coordinates alone are shown and used, so the farmer is never blocked. The typed place name to coordinates path is unchanged.
PRD ref: `prd.md > Location and weather`.

### Weather
`weather.js` requests daily rainfall and temperature from the planting date to today and returns `{ rainfallTotalMm, avgTempC, isLive }`. On failure it returns typical-condition values with `isLive: false`.
PRD ref: `prd.md > Location and weather`, `prd.md > States and Boundaries`.

### Yield estimate
`estimate.js` reads `data/reference-data.js` and returns low and high tonnes per acre plus the total. Steps: pick the baseline range for the variety (or the general one) → compute one factor each for pH, nitrogen, phosphorus, potassium, and rainfall → multiply the factors together → multiply the baseline low and high by that → widen the range if `isLive` is false.
PRD ref: `prd.md > Yield estimate`.

### Planning note
`note.js` fills a few plain sentence templates with the estimate's numbers (rule-based, not AI-written).
PRD ref: `prd.md > Planning note`.

### Money (built last)
`money.js` multiplies low and high tonnes by the new price, and compares it with last season's price and spending.
PRD ref: `prd.md > Money`.

### Logging
`log.js` exports `log(message)` and `logError(message, error)`, which write to the browser console with a timestamp and the step name. Used by location, weather, and estimate.
PRD ref: supports `prd.md > States and Boundaries`.

## Data Model
Nothing is saved between visits. All data lives in memory while the page is open and disappears when it is closed (matches `prd.md > States and Boundaries`).
- **Form values** `{ acres, ph, n, p, k, variety, plantingDate, location }` — kept in memory, updated as he types.
- **Weather** `{ rainfallTotalMm, avgTempC, isLive }` — fetched once per estimate.
- **Estimate** `{ lowPerAcre, highPerAcre, total range, label }` — recalculated on each run.
- **Reference data** — a read-only file, `data/reference-data.js`, labeled SAMPLE: baseline ranges per variety (plus a general one), factor bands for pH, N, P, K, rainfall, typical-season rainfall and temperature used when live weather is unavailable, and plausible ranges for checks. Numbers are placeholders; real sources replace them later.
- **Facts** — a read-only file, `data/facts.js`: text plus source for each.

## File Structure
```
shamba-bora/            (project root)
├── index.html          # the page: form, result, pop-up containers
├── css/
│   └── styles.css      # exact colors, serif type, square corners
├── js/
│   ├── app.js          # connects the steps in order
│   ├── intro.js        # animation and fact pop-up
│   ├── validate.js     # blank / unusual checks
│   ├── location.js     # browser location + typed-place fallback
│   ├── weather.js      # Open-Meteo request and totals
│   ├── estimate.js     # reference table + factors -> range
│   ├── note.js         # planning note text
│   ├── money.js        # income and price comparison (last)
│   └── log.js          # console logging
├── data/
│   ├── reference-data.js   # SAMPLE yield table and factor bands
│   └── facts.js            # verified facts with sources
├── devpost/            # Devpost learning workspace
└── README.md           # how to run, for reviewers
```

## External Services and Dependencies
All unverified in this session; verify at the start of the build.
- **Open-Meteo weather (past/current):** request with latitude, longitude, start date, end date, daily rainfall and temperature; reply is JSON with daily arrays. No key. Check free-use terms, data delay for recent days, and how to cover a planting date months ago.
- **Open-Meteo geocoding:** request with a place name; reply lists matches with latitude and longitude. No key.
- **Browser Geolocation API:** built in; asks the user; works on `localhost`.
- **BigDataCloud browser-side reverse geocoding (added in the build, learner-approved):** request `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=..&longitude=..&localityLanguage=en`; reply includes `locality`, `city`, `principalSubdivision`, `countryName`. No key. Docs: https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api. **Free-use terms not verified; the learner should read them before public sharing.**

## Important Failure Modes
- **Location refused or unavailable** → he types a place name and continues.
- **Place name not found** → "We couldn't find that place — try a nearby town."
- **Name for the device location can't be fetched** → coordinates alone are shown and used.
- **Weather request fails (no signal, service down)** → friendly message, "try again", and an optional continue with "typical conditions"; range widened; logged to the console.
- **Odd or blank inputs** → the "are you sure?" or "please fill this in" messages; never silently accepted or crashed on.

## What Was Simplified and Why
- **Sample reference table with adjustment rules** instead of a model trained on real harvest data — no real yield data exists yet. The fuller version fits a model on actual harvests.
- **Nothing saved between visits** instead of accounts and a database — not needed to prove the estimate.
- **Typed soil values** instead of reading a photo of the report — OCR is its own project.
- **Rule-written planning note** instead of AI-written text — keeps it explainable and free of extra services.
- **Local run plus recorded video** instead of a deployed site — meets submission; deployment optional.

## Decisions and Open Issues
**Learner decisions**
- Plain HTML, CSS, JavaScript — "the plain Html, css javascript is okay".
- Sample dataset for the prototype — "simulated dataset for the prototype as the source may not have a way to access via API".
- Fastest approach for the estimate — the reference table with simple rules (recommended and accepted when they asked for the fastest approach).

**Learning questions (the learner asked to understand these)**
How errors are logged, how the browser asks for location, how the weather lookup works, and how numbers become a range. Explained in conversation. To be shown in the build: open the console and read the log messages; see the browser's location prompt and the coordinates it returns; view the raw weather reply; and step through the estimate's factors to the final low and high.

**Agent recommendations awaiting agreement**
- Place-name lookup for the manual location fallback.
- Local `python3 -m http.server` for running and recording.

**Open issues**
- Verify Open-Meteo URLs, terms, and the historical/recent data approach (start of build).
- Sample reference numbers need to be chosen, labeled SAMPLE, and kept plausible (build step).
- The learner's task: three to five verified sugarcane facts with sources, before the pop-up is finished.
- Interface language: English for now (open from the PRD).
