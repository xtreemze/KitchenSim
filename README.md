# KitchenSim

KitchenSim is a browser-based household kitchen workflow simulation built with TypeScript, Vite, and Babylon.js. It combines a procedural 3D room with a deterministic household model so layout, family size, appliance choices, waste handling, and time-of-day settings produce visible changes in both the scene and the telemetry.

## What is implemented

### Responsive kitchen layout

Room width, length, and ceiling height rebuild the room geometry. Cabinet count and placement are regenerated against the available wall span instead of remaining at fixed coordinates. Enabled appliances and configured waste streams are also represented as scene objects and reposition with the room.

### Five-stage household simulation

The running simulation advances through the same workflow advertised by the project:

1. grocery storage;
2. meal preparation;
3. meal serving;
4. cleaning;
5. waste disposal and sorting.

Each stage changes the simulation state. A complete cycle records food inventory and consumption, portions prepared/served, utensil and dish use, energy, water, waste generation, bin fill, collections, recycling, composting, landfill, and cumulative sorting accuracy.

### Household avatars that perform the workflow

Family size controls the number of geometric household avatars in the kitchen. As the lifecycle changes, avatars move to stage-specific work zones. Configured household roles are assigned across the avatars and matching roles are prioritized for the corresponding stage. Avatars are pickable: selecting one shows its current task in the telemetry panel.

### Live telemetry

The right-side telemetry panel reports the current stage and region together with real-time household metrics and a short event history. It can be disabled from Advanced Controls.

### Working controls

- **Basic**: family size, grocery frequency, meal-prep frequency, cooking frequency, room dimensions, and enabled appliances.
- **Advanced**: lighting intensity/brightness/color temperature, waste collection interval, bin capacity, sorted waste streams, appliance efficiency, ventilation, cabinet animation, and telemetry visibility.
- **Expert**: starting time of day, household roles and weighting, simulation speed, and regional recycling profile.

The time-of-day setting combines with simulated elapsed time to drive sky luminance and scene light intensity while the simulation runs.

### Regional recycling behavior

KitchenSim currently models three deliberately simplified regional profiles: **USA**, **Japan**, and **EU**. They use different recyclable/compost/hazardous capture rates, so changing region or disabling a sorted waste stream materially changes recycling, composting, landfill, and sorting-accuracy results.

These profiles are simulation assumptions, not regulatory guidance. See [`docs/SIMULATION_MODEL.md`](docs/SIMULATION_MODEL.md) for the exact model.

## Run locally

Prerequisites: Node.js 22+ and npm.

```bash
git clone https://github.com/xtreemze/KitchenSim.git
cd KitchenSim
npm install --registry=https://registry.npmjs.org
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

## Verification

```bash
npm run typecheck
npm test
npm run build
# or all three:
npm run check
```

The simulation-domain tests use Node's built-in test runner after compiling only the pure TypeScript simulation modules. Pull requests install from the public npm registry, then run type-checking, tests, and a production build before merge. Pushes to `main` run the same checks before deploying the built Vite application to GitHub Pages.

## Architecture

```text
KitchenSim/
├── src/
│   ├── app/                     # Babylon scene, room geometry and dynamic layout
│   ├── components/
│   │   ├── avatars/             # Household avatar behavior and interaction
│   │   └── settings/            # Basic / Advanced / Expert controls
│   ├── simulation/
│   │   ├── SimulationEngine.ts  # Pure deterministic household model
│   │   ├── SimulationRuntime.ts # Browser scheduling and subscriptions
│   │   ├── recycling.ts         # Regional waste-processing rules
│   │   ├── Dashboard.ts         # Live telemetry surface
│   │   └── types.ts             # Domain types and lifecycle stages
│   ├── models.ts                # Bridge between controls, simulation and scene
│   └── main.ts                  # Application bootstrap
├── tests/                       # Simulation-domain tests
├── docs/                        # Model assumptions and design notes
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Model scope

KitchenSim is an exploratory workflow and ergonomics simulator. Its resource-use and recycling equations are intentionally transparent and deterministic so interactions can be compared; they are not calibrated building-science, appliance-certification, nutrition, or municipal-waste models.

## Roadmap — not implemented yet

- calibrated ventilation and airflow simulation;
- richer storage-capacity and reach/ergonomic constraints;
- downloadable analytics/history exports;
- higher-fidelity appliances, utensils, food assets, and task animations;
- scenario persistence and comparison;
- shared/multiplayer or VR planning sessions.

Roadmap items are intentionally separated from implemented capabilities so the project presentation remains verifiable against the codebase.

## License

KitchenSim is distributed under the proprietary terms in [`LICENSE`](LICENSE). The repository permits personal, non-commercial use under those terms; it is **not** MIT-licensed.
