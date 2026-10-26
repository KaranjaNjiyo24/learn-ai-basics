# Shamba Bora: Context and How It Works

Shamba Bora is a phone-friendly web app that gives a sugarcane farmer a pre-harvest yield estimate for his own land, so he can plan money and labour before cutting.

> **Status: proof of concept.** The reference numbers behind the estimate are illustrative sample data, not real harvest records. The app says this on screen. See [Limits](#limits-and-honesty).

## The problem, through one farmer

John is a smallholder sugarcane farmer. He gets his cane seedlings from the sugar miller he will sell to, plants them, and then waits. Cane here usually matures 18 to 24 months after planting, so a whole season of cost (labour, fertiliser, transport) is spent before he knows what he will earn. He has soil figures from a soil report and he knows his acreage and cane variety, but he has no way to turn those into an expected harvest.

The question John needs answered is: **"Roughly how many tonnes will my land give me, and what might that earn me?"**

Shamba Bora answers that with a low-to-high range, not a single confident number, and shows its working.

## What John does in the app

1. Opens the app on his phone. A short intro animation plays, then the Home screen.
2. Enters his farm details: acres, cane variety (as supplied by the miller), planting date, and where the farm is (typed place name, or "use my location").
3. Enters his soil report values: pH, nitrogen, phosphorus, potassium.
4. Optionally enters the miller's new season price per tonne, last season's price, and what he spent last year.
5. Taps **Show my estimate** and gets:
   - an expected harvest per acre and for the whole farm, as a low-to-high range in tonnes;
   - a plain-language planning note (plan money around the low figure, labour and transport around the high figure, and which input is holding the estimate back most);
   - expected income as a range, if he entered a price, with the comparison to last season's price and spending.

## Features

| Feature | What it does |
|---|---|
| Farm form | Collects acres, variety, planting date and place, with friendly checks on every field. |
| Soil report form | Collects pH, N, P and K. |
| Place lookup | Turns a typed place name into coordinates (Open-Meteo geocoding). |
| Device location | Optional. Uses the phone's GPS and shows a readable place name (BigDataCloud reverse geocoding). Typing a place always works as a fallback. |
| Live season weather | Fetches rainfall and temperature from planting date to today for that spot (Open-Meteo historical weather). |
| Weather fallback | If live weather cannot be fetched, uses typical conditions, widens the range, and says so. |
| Yield estimate | Low-to-high tonnes per acre and in total. |
| Planning note | Short rule-built sentences from the estimate's own numbers. Not AI-written. |
| Income and price comparison | Optional. Expected income range, price change versus last season, and income next to last year's spending. Blank fields are skipped, never an error. |
| Input validation | Separates "missing", "impossible" (must fix) and "unusual" (are you sure?). |
| Did you know? | A page of sugarcane facts, each supplied and confirmed by the app's author. The app never writes its own facts. |
| Navigation bar | Home, Did you know?, My farm. |

## Data collected

| Data | Why it is needed | Where it goes |
|---|---|---|
| Acres | Scales per-acre estimate to the whole farm | Stays in the browser |
| Cane variety | Selects the baseline range (currently one general range for all varieties) | Stays in the browser |
| Planting date | Works out crop age and the weather window | Stays in the browser; the date range is part of the weather request |
| Soil pH, N, P, K | Each adjusts the estimate up or down | Stays in the browser |
| Place name or GPS coordinates | Finds local weather | Sent to Open-Meteo (and BigDataCloud for the device-location name) |
| Optional prices and spending | Income comparison | Stays in the browser |

There is no account, no server of our own, and no database. Nothing is saved between visits. The only data that leaves the phone is the location sent to the free weather and place-lookup services.

## How the estimate is calculated

The estimate is a transparent, rule-based calculation, not a trained model.

1. Start from a **baseline range** of tonnes per acre for good conditions (sample values: 20 to 35).
2. Work out one **factor** for each input. A factor of 1.0 means "no effect"; below 1.0 pulls the estimate down.
   - **Soil pH**: ideal band scores 1.0, wider acceptable bands score less.
   - **Nitrogen, phosphorus, potassium**: below a threshold scores less than 1.0, otherwise 1.0.
   - **Rainfall so far**: total rain since planting is compared with what the crop needs for its age. The reference crop cycle is 21 months (about 640 days, the midpoint of the 18 to 24 month maturity range), needing about 2,100 mm in total. A younger crop needs a proportional share. Too dry pulls the estimate down most, very wet pulls it down slightly.
3. **Multiply** the factors together and apply the result to the baseline low and high.
4. If the weather was not live, **widen** the range.
5. Multiply by acres to get totals. Income is totals multiplied by John's price per tonne.

## How explainable it is

Explainability is the main design goal. John should be able to see why the number is what it is.

- **No black box.** Every step above is a plain rule in a small file ([`js/estimate.js`](../js/estimate.js)), and every threshold sits in one readable file ([`data/reference-data.js`](../data/reference-data.js)).
- **A range, not a promise.** The low and high figures are shown together so the uncertainty is visible.
- **Per-input effect.** The result screen's "How this was worked out" panel shows each input's factor and its effect in plain terms (for example "8% lower"), and the planning note names the one holding the estimate back the most.
- **Maturity shown.** The panel states how many months old the cane is, how far it is toward the 24-month latest maturity, and the expected cutting window (planting date plus 18 to 24 months). If the cane is past 24 months it says it is ready or overdue.
- **Rain shown against need.** The panel shows the rain that fell since planting next to the rain a crop of that age needs.
- **The arithmetic is spelled out.** Low = baseline low × combined factor; high = baseline high × combined factor.
- **Honest fallbacks.** When live weather is missing or the variety has no specific data, the app says it used typical weather or the general range, and widens the range.
- **Rule-built wording.** The planning note and income sentences come from fixed templates filled with the calculated numbers.
- **Inspectable.** Technical detail for each step is written to the browser console (F12, Console) while the screen stays plain.

## Limits and honesty

- **The reference numbers are sample data.** The baseline, factor bands and thresholds are placeholders, not published agronomic figures or real harvest records. They need to be replaced with sourced values before anyone relies on the output.
- **No accuracy is claimed.** There is no harvest data yet to measure the estimate against.
- **Varieties are not yet differentiated.** The variety table is empty, so every variety uses the general range, and the app says so.
- **Season length is a mid-point.** The rainfall comparison uses a 21-month (640-day) cycle. Real maturity varies from 18 to 24 months with variety and altitude, so the cycle length and the 2,100 mm need are sample figures to replace with sourced values.
- **Nutrient units are assumed** to be mg/kg (ppm) and should be checked against the units on the soil report.
- **Needs a connection.** Weather and place lookup need internet; without it the app falls back to typical weather.

## What would come next

- Replace sample numbers with sourced figures and variety-specific baselines.
- Train a prediction model on real harvest records, then compare the model against these rules.
- Use variety-specific maturity periods rather than one mid-point.
- Cost per acre and profit planning.
- Other crops and regions.

## Running it locally

From the project folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Serve it over `localhost` rather than opening `index.html` directly, so module loading and browser location work.
