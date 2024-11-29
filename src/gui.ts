import { Nullable, Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, Button, Control } from "@babylonjs/gui";
import { createTitle, createSlider, createCheckboxGroup, createRadioGroup } from "./guiHelpers";

export function createGUI(scene: Nullable<Scene> | undefined) {
  const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

  // Create a root stack panel
  const rootPanel = new StackPanel();
  rootPanel.width = "300px";
  rootPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  rootPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  guiTexture.addControl(rootPanel);

  // Create mode selection buttons
  const modeSelectionPanel = new StackPanel();
  modeSelectionPanel.isVertical = false;
  modeSelectionPanel.height = "50px";
  rootPanel.addControl(modeSelectionPanel);

  const modes = ["Basic", "Advanced", "Expert"];
  const modePanels: { [key: string]: StackPanel } = {}; // Store panels for toggling

  modes.forEach((mode) => {
    const button = Button.CreateSimpleButton(`${mode}ModeButton`, mode);
    button.width = "80px";
    button.height = "30px";
    button.color = "white";
    button.background = "gray";
    button.isPointerBlocker = true; // Ensure button captures pointer events
    button.onPointerUpObservable.add(() => {
      console.log(`Mode switched to: ${mode}`); // Debug message
      toggleMode(mode, modePanels);
    });
    modeSelectionPanel.addControl(button);

    // Create mode-specific panels
    const panel = new StackPanel();
    panel.isVisible = mode === "Basic"; // Only show Basic mode initially
    panel.width = "300px";
    panel.isVertical = true;
    rootPanel.addControl(panel);
    modePanels[mode] = panel;
  });

  // Populate mode-specific panels
  createBasicControls(modePanels["Basic"]);
  createAdvancedControls(modePanels["Advanced"]);
  createExpertControls(modePanels["Expert"]);
}

// Helper to toggle between modes
function toggleMode(activeMode: string, modePanels: { [x: string]: StackPanel }) {
  Object.keys(modePanels).forEach((mode) => {
    const panel = modePanels[mode];
    panel.isVisible = mode === activeMode; // Show only the active mode panel
    panel.markAsDirty(); // Force redraw to reflect visibility changes
  });
}

// Basic Mode Controls
function createBasicControls(panel: StackPanel) {
  const title = createTitle("Basic Controls");
  panel.addControl(title);

  createSlider("Family Size:", 1, 6, 4, "Family Size", panel);
  createSlider("Grocery Trip Frequency:", 1, 7, 3, "Grocery Frequency", panel);
  createSlider("Meal Prep Frequency:", 1, 4, 2, "Meal Prep Frequency", panel);

  const appliances = ["Dishwasher", "Microwave", "Oven"];
  createCheckboxGroup(appliances, "Appliances Enabled", panel);
}

// Advanced Mode Controls
function createAdvancedControls(panel: StackPanel) {
  const title = createTitle("Advanced Controls");
  panel.addControl(title);

  const mealTypes = ["Cooked", "Pre-Packaged", "Mixed"];
  createRadioGroup(mealTypes, "Meal Type", panel);

  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Custom"];
  createCheckboxGroup(dietaryOptions, "Dietary Preferences", panel);

  createSlider("Dishwasher Usage (times/day):", 0, 3, 1, "Dishwasher Usage", panel);
  createSlider("Microwave Usage (times/day):", 0, 10, 5, "Microwave Usage", panel);
  createSlider("Oven Usage (times/day):", 0, 5, 2, "Oven Usage", panel);
}

// Expert Mode Controls
function createExpertControls(panel: StackPanel) {
  const title = createTitle("Expert Controls");
  panel.addControl(title);

  createSlider("Time of Day (hours):", 0, 24, 12, "Time of Day", panel);
  createCheckboxGroup(["Enable Seasonal Adjustments"], "Seasonal Settings", panel);

  createSlider("Waste Disposal Frequency (days):", 1, 7, 3, "Waste Frequency", panel);
  createSlider("Bin Capacity (liters):", 10, 50, 30, "Bin Capacity", panel);

  createSlider("Lighting Brightness (%):", 0, 100, 75, "Lighting Brightness", panel);
  createSlider("Color Temperature (K):", 2000, 6500, 4000, "Color Temperature", panel);

  createSlider("Appliance Efficiency (%):", 50, 150, 100, "Efficiency", panel);

  const roles = ["Cooking", "Cleaning", "Grocery Shopping"];
  createCheckboxGroup(roles, "Assign Roles", panel);
}
