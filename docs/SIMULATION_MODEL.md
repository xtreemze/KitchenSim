# KitchenSim simulation model

KitchenSim uses a deterministic model so the effect of controls is visible and repeatable. The numbers below are intentionally simplified behavioral assumptions rather than calibrated real-world measurements.

## Lifecycle

Each simulation cycle contains five stages, each representing 1.25 simulated hours:

1. **Grocery storage** — restocks toward a target inventory based on household size and days between grocery trips.
2. **Meal preparation** — consumes inventory, creates portions, records utensil/dish use, and adds appliance/ventilation energy.
3. **Meal serving** — converts prepared portions to served portions and adds serving utensils/dishes.
4. **Cleaning** — clears the accumulated dish load; dishwasher-enabled households trade water for electricity while hand washing uses more water and no dishwasher electricity.
5. **Waste disposal** — generates a repeatable waste mix from consumed food and household size, then applies the selected regional sorting profile.

## Demand relationships

The current model intentionally makes these control relationships observable:

- larger households consume more groceries, prepare more portions, use more utensils, and generate more waste;
- more frequent cooking increases food throughput and appliance energy;
- higher appliance-efficiency percentages reduce modeled appliance energy through an inverse efficiency factor;
- enabling a dishwasher changes cleaning water/electricity behavior;
- enabled cooking appliances contribute different nominal energy loads;
- ventilation contributes energy according to its enabled state and speed;
- waste collection occurs when the modeled bin reaches capacity or the configured collection interval is reached;
- simulation speed changes wall-clock scheduling only; it does not change per-stage resource accounting.

## Waste profile

Waste generated during each cycle is split into a fixed composition before regional processing:

| Stream | Share |
| --- | ---: |
| Compost | 46% |
| Plastic | 18% |
| Glass | 6% |
| Paper | 12% |
| Metal | 4% |
| Hazardous | 1% |
| General | 13% |

A stream that requires sorting but is disabled in Advanced Controls is treated as landfill for that cycle and lowers sorting accuracy.

## Regional profiles

Regional profiles are deliberately illustrative. They are not statements of actual municipal performance or legal requirements.

| Region | Recyclables captured | Compost captured | Hazardous stream captured |
| --- | ---: | ---: | ---: |
| USA | 62% | 55% | 72% |
| Japan | 90% | 38% | 92% |
| EU | 82% | 80% | 88% |

Recyclable streams are Plastic, Glass, Paper, and Metal. Compost is the compostable stream. Hazardous material is counted as correctly sorted when captured but is not counted as recycled or composted.

## Lighting and time

The Expert time-of-day input sets the simulation's starting hour. Simulated elapsed time is added to that start time. Scene daylight uses a sinusoidal daytime factor, while Advanced Controls scale light intensity, brightness, and color-temperature interpolation.

## Geometry and avatars

Room dimensions rebuild the floor, walls, and ceiling. Cabinet density is calculated from usable wall width, and appliances/waste stations are regenerated against the new room dimensions.

Household size controls avatar count. Roles are distributed over the household. During each stage, avatars move to a corresponding work zone; avatars whose configured role matches the stage are ordered first. Selecting an avatar exposes its current task in the telemetry panel.

## Why the model is deterministic

KitchenSim currently favors comparability over stochastic realism. Given the same settings and number of steps, it produces the same metrics. That makes changes to layout and behavior easier to evaluate and gives the test suite stable invariants. Future probabilistic behavior should preserve a seeded deterministic mode for repeatable comparisons and regression tests.
