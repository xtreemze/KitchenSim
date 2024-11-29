# Kitchen Simulation

## Overview

The Kitchen Simulation is an interactive and dynamic tool designed to model the workflow and ergonomics of a household kitchen. It allows users to simulate grocery storage, meal preparation, cleaning, and waste management while visualizing real-time data outputs. The application is built using Babylon.js for immersive 3D graphics and provides user-friendly controls for customization.

## Features

- **Dynamic Kitchen Layouts**: Automatically adjusts cabinet and storage dimensions based on user inputs.
- **Simulation Cycles**: Includes stages such as grocery storage, food preparation, meal serving, cleaning, and waste disposal.
- **Interactive Avatars**: Represents family members as geometric figures performing actions in the kitchen.
- **Data Tracking**: Monitors grocery consumption, utensil usage, and waste generation with visual and data-driven outputs.
- **User Controls**:
  - Sliders for household size, meal frequency, grocery trips, and more.
  - Toggles for enabling/disabling appliances like dishwashers and microwaves.
  - Day-night cycle adjustments to simulate lighting and activities over time.
- **Global Recycling Systems**: Tailored waste management options based on regional practices.

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **npm**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/xtreemze/KitchenSim.git
   cd KitchenSim
   ```bash

2. Install dependencies:

   ```bash
   npm install
   ```bash

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the application in your browser:

   ```bash
   http://localhost:3000
   ```

### Project Structure

The application is organized as follows:

```bash
KitchenSim/
├── public/                     # Static assets (textures, models, shaders)
├── src/                        # Source code
│   ├── main.ts                 # Application entry point
│   ├── app/                    # Core simulation logic
│   ├── components/             # Modular reusable 3D components
│   ├── workers/                # Web workers for parallel tasks
│   ├── utils/                  # Helper functions
│   ├── styles/                 # CSS for UI
├── tests/                      # Unit and integration tests
├── .vscode/                    # VSCode settings
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Documentation
```

### Usage

1. Adjust sliders and toggles in the user interface to set parameters like:
   - Number of family members.
   - Frequency of meals and grocery trips.
   - Appliance usage and waste disposal preferences.

2. Observe how the kitchen layout and simulation cycles adapt to your inputs.

3. View data insights such as:
   - Grocery usage trends.
   - Waste generation and recycling accuracy.
   - Appliance efficiency.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes and push to your fork:

   ```bash
   git add .
   git commit -m "Add feature-name"
   git push origin feature-name
   ```

4. Submit a pull request.

## Roadmap

- **Lighting and Ventilation**: Dynamic shadows and airflow simulation ([KitchenLife_Design_Document.txt](./docs)).
- **Advanced User Controls**: Detailed appliance usage, waste tracking, and recycling profiles.
- **Data Analytics**: Export metrics on kitchen efficiency and workflows.
- **Multiplayer VR Integration**: Plan and interact with the kitchen in a shared virtual environment.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Developed with **Babylon.js** and modern web technologies.
- Inspired by ergonomic studies and household efficiency principles.

---
