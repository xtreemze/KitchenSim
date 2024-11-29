import { Mesh, HemisphericLight } from '@babylonjs/core';
import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, makeDraggable } from './guiHelpers';

export function setupGUI(cabinet: Mesh, light: HemisphericLight) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '300px';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  container.style.color = 'white';
  container.style.padding = '10px';
  container.style.borderRadius = '8px';
  container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  container.style.cursor = 'move';
  document.body.appendChild(container);

  makeDraggable(container);

  // Create tabs
  const tabs = document.createElement('div');
  tabs.style.display = 'flex';
  tabs.style.justifyContent = 'space-between';
  tabs.style.marginBottom = '10px';
  container.appendChild(tabs);

  const createTabButton = (name: string, panel: HTMLElement) => {
    const button = document.createElement('button');
    button.innerText = name;
    button.style.flex = '1';
    button.style.margin = '0 5px';
    button.style.padding = '10px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = 'gray';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.onclick = () => {
      basicPanel.style.display = 'none';
      advancedPanel.style.display = 'none';
      expertPanel.style.display = 'none';
      panel.style.display = 'block';
    };
    tabs.appendChild(button);
  };

  const basicPanel = document.createElement('div');
  const advancedPanel = document.createElement('div');
  const expertPanel = document.createElement('div');

  createTabButton('Basic', basicPanel);
  createTabButton('Advanced', advancedPanel);
  createTabButton('Expert', expertPanel);

  container.appendChild(basicPanel);
  container.appendChild(advancedPanel);
  container.appendChild(expertPanel);

  basicPanel.style.display = 'block';
  advancedPanel.style.display = 'none';
  expertPanel.style.display = 'none';

  // Add Basic controls
  addBasicControls(basicPanel, cabinet, light);

  // Add Advanced controls
  addAdvancedControls(advancedPanel, cabinet);

  // Add Expert controls
  addExpertControls(expertPanel, cabinet, light);
}

function addBasicControls(panel: HTMLElement, cabinet: { isVisible: boolean; }, light: any) {
  const title = createTitle('Basic Controls');
  panel.appendChild(title);

  const toggleButton = document.createElement('button');
  toggleButton.innerText = 'Toggle Cabinet';
  toggleButton.style.width = '100%';
  toggleButton.style.marginBottom = '10px';
  toggleButton.style.padding = '10px';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '4px';
  toggleButton.style.backgroundColor = 'gray';
  toggleButton.style.color = 'white';
  toggleButton.style.cursor = 'pointer';
  toggleButton.onclick = () => {
    cabinet.isVisible = !cabinet.isVisible;
  };
  panel.appendChild(toggleButton);

  createSlider('Family Size:', 1, 6, 4, 'Family Size', panel);
  createSlider('Grocery Trip Frequency:', 1, 7, 3, 'Grocery Frequency', panel);
  createSlider('Meal Prep Frequency:', 1, 4, 2, 'Meal Prep Frequency', panel);

  const appliances = ['Dishwasher', 'Microwave', 'Oven'];
  createCheckboxGroup(appliances, 'Appliances Enabled', panel);
}

function addAdvancedControls(panel: HTMLElement, cabinet: { scaling: { x: number; }; }) {
  const title = createTitle('Advanced Controls');
  panel.appendChild(title);

  createSlider('Cabinet Width:', 1, 5, 2, 'Cabinet Width', panel);

  const mealTypes = ['Cooked', 'Pre-Packaged', 'Mixed'];
  createRadioGroup(mealTypes, 'Meal Type', panel);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Custom'];
  createCheckboxGroup(dietaryOptions, 'Dietary Preferences', panel);

  createSlider('Dishwasher Usage (times/day):', 0, 3, 1, 'Dishwasher Usage', panel);
  createSlider('Microwave Usage (times/day):', 0, 10, 5, 'Microwave Usage', panel);
  createSlider('Oven Usage (times/day):', 0, 5, 2, 'Oven Usage', panel);
}

function addExpertControls(panel: HTMLElement, cabinet: any, light: { intensity: number; }) {
  const title = createTitle('Expert Controls');
  panel.appendChild(title);

  createSlider('Light Intensity:', 0, 2, 1, 'Light Intensity', panel);

  createSlider('Time of Day (hours):', 0, 24, 12, 'Time of Day', panel);
  createCheckboxGroup(['Enable Seasonal Adjustments'], 'Seasonal Settings', panel);

  createSlider('Waste Disposal Frequency (days):', 1, 7, 3, 'Waste Frequency', panel);
  createSlider('Bin Capacity (liters):', 10, 50, 30, 'Bin Capacity', panel);

  createSlider('Lighting Brightness (%):', 0, 100, 75, 'Lighting Brightness', panel);
  createSlider('Color Temperature (K):', 2000, 6500, 4000, 'Color Temperature', panel);

  createSlider('Appliance Efficiency (%):', 50, 150, 100, 'Efficiency', panel);

  const roles = ['Cooking', 'Cleaning', 'Grocery Shopping'];
  createCheckboxGroup(roles, 'Assign Roles', panel);
}
