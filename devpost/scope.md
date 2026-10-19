---
doc: scope
status: approved
---

# Cane Yield Planner

A phone-friendly app that gives a sugarcane farmer an honest pre-harvest estimate of what his land will produce, so he can plan money and labor.

## The Unique Kernel
The farmer enters what he already knows about his own land (acres, soil composition, cane variety) and the app uses his phone's location to pull the local weather itself. He gets a yield estimate for his own plot, shown as a low-to-high range, not a generic national average. The estimate is honest about being a reference-based estimate until real harvest data exists to learn from.

## Who It's For
A friend of the learner who leased 10 acres of land and is growing sugarcane. The seed variety comes from the sugar company he will sell to, and he knows his soil composition and location. Today he has "no idea how much I will harvest," so he can't plan money and labor with confidence.

## The Core Loop
He opens the app, enters his acres, soil values, and cane variety, and allows location access. The app fetches rainfall and temperature for that spot and shows an expected harvest for his land, with a low-to-high range and a short note on what it means for planning money and labor. He returns as the season goes on and to compare against what he actually harvests.

## Inspiration & Identity
No specific references shared yet. Direction volunteered: a tool for farmers that is practical and usable on a phone. `3-prd` will fill the look and feel.

## Why This Matters to the Learner
"I love working by giving back." This grows out of the learner's IMTA work, turning farm data into decisions for a community, and points toward AI for social good and a possible PhD. They want "something useable in future that can be built upon and support more people, a workable prototype scalable with time."

## What "Working" Looks Like
In a short demo, the farmer enters 10 acres, his soil values, and a cane variety, and taps to use his location. The weather appears, and the screen shows an expected harvest for his 10 acres with a low-to-high range and a planning note. The learner reacted to this sketch: "matches really nicely what I have in mind."

## The POC Boundary
- One user (the learner's friend), one crop (sugarcane).
- Inputs: acres, soil composition, cane variety, location (from phone GPS).
- Weather fetched automatically for that location.
- A reference-based yield estimate adjusted by those inputs, shown as a range and clearly labeled as an estimate.
- A short plain-language planning note for money and labor.

## Later
- Train a real prediction model on actual harvest data (his and others'), so the tool improves over time.
- Cost per acre using market information, and profit planning.
- Other users: leasing companies and early-career farmers.
- Other crops and regions.

## Explicitly Cut
- Claiming prediction accuracy: there is no yield data yet to support it.
- Market price and cost-per-acre calculations: not needed for the harvest-expectation decision the friend named; revisit once yield is working.
- Multiple user types and crops: one specific user keeps the proof of concept testable.
