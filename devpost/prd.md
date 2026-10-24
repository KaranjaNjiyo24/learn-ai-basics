---
doc: prd
status: approved
---

# Shamba Bora — Product Requirements

A phone-friendly app that gives a sugarcane farmer an honest pre-harvest estimate of his yield per acre, so he can plan money and labor. Built first for the learner's friend, who leased 10 acres and is growing sugarcane.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey
1. He opens the app and sees an opening animation: a sugarcane stalk grows from a young shoot to a fully grown cane, in a proper cane green. (`scope.md > Inspiration & Identity`)
2. A "Did you know?" pop-up shows one verified fact about sugarcane. He closes it.
3. He reaches the input screen and fills in his farm details: acres, soil values (pH, nitrogen, phosphorus, potassium), cane variety, planting date.
4. He allows location access. The app uses his phone's position to fetch the weather for his farm. If he refuses, he types his location instead.
5. He taps to get his estimate. The app shows the result: expected tonnes per acre with a low-to-high range, the total for his acres, and a short planning note for money and labor.
6. Optionally, he enters prices and last year's spending, and the app shows expected income next to that spending. (Built last; see **What We're Building**.)

Success: he can see, in under a minute, an expected harvest for his own land, clearly marked as an estimate. (`scope.md > What "Working" Looks Like`)

## Screens and Layout
A navigation bar stays at the top of every screen once the opening animation is done (see **Navigation bar**). Three surfaces, in one flow:
- **Opening screen.** The sugarcane growth animation, then the "Did you know?" pop-up.
- **Input screen.** One form, one column, built for a phone. Fields in a clear order: acres; soil (pH, nitrogen, phosphorus, potassium); cane variety; planting date; location. A single button to get the estimate. An optional "money" section (new season price per tonne, last season's price per tonne, last year's spending) sits below, collapsed, and is not needed to get a yield estimate.
- **Result screen.** The estimate: tonnes per acre as a range, the total for his acres, the planning note, and a clear label that it is an estimate. A way to go back and change inputs.

## Look and Feel
Direction from the learner:
- **Color:** earthy and warm, flat exact colors only, with no tints, shades, hues, or gradients. Exact codes (confirmed by the learner): **brown `#964B00`** for text, borders, and buttons; **green `#008000`** for the sugarcane animation and the main action; **white `#FFFFFF`** as the plain background. No other colors and no lighter or darker variants of these.
- **Shapes:** square ("box") corners on fields, buttons, and cards.
- **Type:** a prominent serif font in the style of Times New Roman.
- **Buttons:** not too big. Plain and easy for anyone to use on a phone.
- **Overall:** plain and warm, easy to use by any person. No gradients or busy decoration.

## Features and Behavior

### Navigation bar
- Added after the build began, at the learner's request: the app should not feel like one long single page, and the farmer should be able to move between its parts from the top. The layout follows the learner's reference image of a plain website header: brand on the left, text links beside it, a thin line under the bar.
- **Layout (left to right):** the app name "Shamba Bora" as the brand (it also takes him home), then the links **Home**, **Did you know?**, and **My farm**. Nothing else is on the bar.
  - **Home** shows the opening animation again.
  - **Did you know?** shows a verified fact, with a way to see another.
  - **My farm** is the input screen and, below it, the result: the farm details, the optional money section, and the estimate.
- The opening flow is unchanged: animation, then the "Did you know?" fact, then **My farm**. The bar is how he moves around after that, or back to an earlier part.
- The link for the part he is on looks marked (bold with a green underline). The bar is a single row that fits a phone screen; if the three links do not fit, they stay in one row and shrink rather than hiding in a menu.
- **Look:** flat and plain, in the colors already agreed. White bar, brown text, a green underline for the current link, and a thin solid brown line under the bar instead of a shadow. Same Times New Roman style serif, square corners, no gradients, no extra colors. Only the arrangement is taken from the reference image, not its colors or fonts.
- **Not on the bar:** the reference image also shows a search icon, a notification bell, an account picture, and drop-down arrows. None of these are included: the app has no search, no notifications, and no accounts or logins (see **Deferred From the POC**), and each link goes straight to one place, so there are no drop-downs.
  - [ ] The bar shows on the input and result screens, with the brand and the three links.
  - [ ] Tapping each link shows the matching part, and the current one is marked.
  - [ ] Moving between links does not erase what he has typed or the result he has already seen.
  - [ ] The bar fits a phone screen in one row and uses only the agreed colors and font.

### Opening animation and "Did you know?"
- A sugarcane stalk grows to full height in cane green, then a pop-up shows one fact and a close button.
- Facts come from a short fixed list of three to five that the learner has verified against a source they trust (for example, the Kenya Sugar Board or a sugar company publication). The app never generates facts. One is shown at random. Each fact is stored with its source.
  - [ ] The animation plays on opening and ends on the pop-up.
  - [ ] The pop-up shows one fact from the verified list and can be closed.
  - [ ] Closing it leads to the input screen.
- The cane drawing is several jointed green stalks with long arching leaves, sized to fit comfortably on a phone and a desktop screen. It never fills more than about half the screen's height.
  - [ ] The animation shows recognizable sugarcane (stalks with joints and leaves), flat `#008000` on white, and does not make the page scroll.

### Farm details
- Typed fields: acres, pH, nitrogen, phosphorus, potassium, cane variety (typed text), and a date picker for "When did you plant?"
- Soil values are entered by typing. Reading a photo of a soil report is a later enhancement.
  - [ ] Every field above is on the input screen and works with a phone keyboard or date picker.
  - [ ] Typing in a field does not require the estimate to be run first.

### Location and weather
- The app asks permission to use his phone's location, then fetches the weather (rainfall and temperature) for that spot.
- If he refuses, he types his location manually. (How he types it, such as a place name or coordinates, is decided in `4-spec`.)
  - [ ] Allowing location fills in the location and the weather appears.
  - [ ] Refusing location lets him enter it by hand and continue.

### Yield estimate
- A reference-based estimate adjusted by his inputs and the weather. Shown as **tonnes per acre as a low-to-high range**, plus the total for his acres.
- Clearly labeled as an estimate. The app does not claim prediction accuracy. (`scope.md > Explicitly Cut`)
  - [ ] With valid inputs, the result screen shows tonnes per acre as a range and the total for his acres.
  - [ ] The result is labeled as an estimate.
  - [ ] Changing an input and running it again changes the result in a sensible direction (for example, more acres changes only the total).

### Planning note
- A short plain-language note under the estimate about planning money and labor around the expected harvest.
  - [ ] A note appears under every estimate, and refers to the numbers shown.

### Money (optional, built last)
- Optional inputs: price per tonne for the new season (from the company's published price), the price per tonne he was paid last season, and last year's spending.
- The result shows **expected income** (expected tonnes × new price) as a range, how the new price compares with last season's, and last year's spending alongside the income.
  - [ ] Leaving the money section blank does not affect the yield estimate.
  - [ ] With a new price entered, expected income appears as a range.
  - [ ] With last season's price entered, the comparison appears.

## States and Boundaries
- **First use.** The input screen is empty with short helper text. No result is shown until the estimate is run.
- **Blank or missing field.** A gentle message asks him to fill it in. He is not blocked from correcting it.
- **Unlikely number** (a pH of 40, a negative acreage). A friendly check such as "That looks unusual — are you sure?" lets him confirm or correct. It is not a harsh error screen.
- **Location refused.** He types his location by hand and continues.
- **Weather can't be fetched** (no signal, service down). A plain message and a "try again" button. He can still continue, and the result is marked "based on typical conditions, not live weather". The app does not show precise-looking numbers it has no data for.
- **Persistence.** Nothing is saved between visits. When he closes the app, his entries are gone. (Saving real harvest results is Later.)

## Product Decisions
- **Name: Shamba Bora** ("good farm") — chosen from Swahili options; friendly and not tied to sugarcane, so other crops fit later.
- **Tonnes per acre as a range, plus the total** — the learner wanted per-acre, and the total is what he plans around.
- **Typed soil values; OCR later** — typing keeps the proof small; photo reading is its own project.
- **Manual location fallback** — the learner's choice when location is denied.
- **Friendly "are you sure?" check** — the learner wanted a notification, not an error.
- **Money section included, built after the yield estimate works** — the learner said it can be part of the proof of concept at a later stage, once yield works.
- **Navigation bar with three links (Home, Did you know?, My farm)** — requested by the learner so the app is not a single long page. The three links follow the learner's own order of the journey (animation, "Did you know?", then the farm details); the learner should confirm them. Search, bell, account picture, and drop-downs from the reference image were left out because the app has no such features.
- **Curated, verified facts only** — the learner wants accurate facts only; a fixed verified list is how that is guaranteed.
- **Plain, earthy, flat exact colors (brown and green, no shades), serif, square corners** — the learner's look; they rejected the softer tinted palette as too generic for the build.

Assumptions (not learner decisions):
- "Actual vs listed" is read as last season's price paid vs the new season's published price, both typed by him. Saving real post-harvest prices is Later.
- The interface text is in English, with the Swahili name. Language is not yet decided (see Open Questions).
- The weather advice (retry plus "typical conditions" label) is the agent's recommendation, accepted by the learner ("All good!").

## What We're Building
In build order (the money section last, and first to drop if time runs short):
1. Input screen with all farm-detail fields and friendly checks.
2. Location with manual fallback, and weather fetch with its failure state.
3. Yield estimate and result screen with the planning note.
4. Opening animation and "Did you know?" pop-up with verified facts.
5. Optional money section with expected income and comparison.
6. Navigation bar to move between Home, Did you know?, and My farm (added during the build).

## Deferred From the POC
- Reading a soil report from a photo (OCR): a separate technical project.
- Saving past results, accounts, or logins: nothing persists in this version.
- Saving the actual post-harvest price paid: needs saved records.

## Possible Later Enhancements
- A model trained on real harvest data so the estimate improves over time.
- Leasing companies and early-career farmers as users.
- Other crops and regions, and a Swahili interface.
- Looking up published prices automatically.

## Non-Goals
- Claiming prediction accuracy: there is no yield data yet to support it.
- Market price tracking: he types the company's price.
- Multiple crops or user types in this version.

## Open Questions
- **Verified facts (before build, learner task).** Which three to five facts, and their sources? Needed before the pop-up is finished, not before `4-spec`.
- **Reference yield figures (before `4-spec`).** What published sugarcane yield figures will the estimate start from? `4-spec` will need to decide this.
- **Interface language (can wait).** English only, or also Swahili?
- **Manual location format (decided in `4-spec`).** Place name or coordinates.
