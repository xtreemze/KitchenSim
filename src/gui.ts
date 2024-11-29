import { Mesh, HemisphericLight } from '@babylonjs/core';
import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createContainer, createTabs, createToggleButton } from './guiHelpers';

export function setupGUI(cabinet: Mesh, light: HemisphericLight) {
  const container = createContainer();

  const basicPanel = document.createElement('div');
  const advancedPanel = document.createElement('div');
  const expertPanel = document.createElement('div');

  createTabs(container, { Basic: basicPanel, Advanced: advancedPanel, Expert: expertPanel });

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

  const simulateButton = createToggleButton('Simulate Kitchen', () => {
    const familySize = parseInt((familySizeGroup.querySelector('input') as HTMLInputElement).value);
    const groceryFrequency = parseInt((groceryFrequencyGroup.querySelector('input') as HTMLInputElement).value);
    const mealPrepFrequency = parseInt((mealPrepFrequencyGroup.querySelector('input') as HTMLInputElement).value);
    const cookingFrequency = parseInt((cookingFrequencyGroup.querySelector('input') as HTMLInputElement).value);
    const appliancesEnabled = Array.from(panel.querySelectorAll('input[type="checkbox"]'))
      .filter((checkbox) => (checkbox as HTMLInputElement).checked)
      .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent);
    const lightingPreset = (panel.querySelector('input[type="radio"]:checked') as HTMLInputElement)?.nextElementSibling?.textContent;

    console.log('Simulating Kitchen with the following settings:');
    console.log('Family Size:', familySize);
    console.log('Grocery Trip Frequency:', groceryFrequency);
    console.log('Meal Prep Frequency:', mealPrepFrequency);
    console.log('Cooking Frequency:', cookingFrequency);
    console.log('Appliances Enabled:', appliancesEnabled);
    console.log('Lighting Preset:', lightingPreset);

    // Here you would add the logic to create the kitchen, space, and people based on the gathered state
  });
  panel.appendChild(simulateButton);
  const familySizeGroup = document.createElement('div');
  createSlider('Family Size:', 1, 12, 4, 'Family Size', familySizeGroup, 'people');
  panel.appendChild(familySizeGroup);

  const groceryFrequencyGroup = document.createElement('div');
  createSlider('Grocery Trip Frequency:', 1, 14, 3, 'Grocery Frequency', groceryFrequencyGroup, 'days');
  panel.appendChild(groceryFrequencyGroup);

  const mealPrepFrequencyGroup = document.createElement('div');
  createSlider('Meal Prep Frequency:', 1, 6, 2, 'Meal Prep Frequency', mealPrepFrequencyGroup, 'times/day');
  panel.appendChild(mealPrepFrequencyGroup);

  const cookingFrequencyGroup = document.createElement('div');
  createSlider('Cooking Frequency:', 1, 10, 3, 'Cooking Frequency', cookingFrequencyGroup, 'meals/day');
  panel.appendChild(cookingFrequencyGroup);

  const appliances = ['Dishwasher', 'Microwave', 'Oven', 'Blender', 'Toaster'];
  createCheckboxGroup(appliances, 'Appliances Enabled', panel);

  const lightingPresets = ['Natural', 'Artificial', 'Hybrid'];
  createRadioGroup(lightingPresets, 'Lighting Presets', panel);

  createCheckboxGroup(['Show Real-Time Metrics'], 'User Feedback System', panel);
}

function addAdvancedControls(panel: HTMLElement, cabinet: { scaling: { x: number; }; }) {
  const title = createTitle('Advanced Controls');
  panel.appendChild(title);

  const cabinetWidthGroup = document.createElement('div');
  createSlider('Cabinet Width:', 1, 10, 2, 'Cabinet Width', cabinetWidthGroup, 'meters');
  panel.appendChild(cabinetWidthGroup);

  const cabinetHeightGroup = document.createElement('div');
  createSlider('Cabinet Height:', 1, 3, 2, 'Cabinet Height', cabinetHeightGroup, 'meters');
  panel.appendChild(cabinetHeightGroup);

  const cabinetDepthGroup = document.createElement('div');
  createSlider('Cabinet Depth:', 0.5, 2, 1, 'Cabinet Depth', cabinetDepthGroup, 'meters');
  panel.appendChild(cabinetDepthGroup);

  const mealTypes = ['Cooked', 'Pre-Packaged', 'Mixed', 'Custom'];
  createRadioGroup(mealTypes, 'Meal Type', panel);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'];
  createCheckboxGroup(dietaryOptions, 'Dietary Preferences', panel);

  const dishwasherUsageGroup = document.createElement('div');
  createSlider('Dishwasher Usage (times/day):', 0, 5, 1, 'Dishwasher Usage', dishwasherUsageGroup, 'times/day');
  panel.appendChild(dishwasherUsageGroup);

  const microwaveUsageGroup = document.createElement('div');
  createSlider('Microwave Usage (times/day):', 0, 20, 5, 'Microwave Usage', microwaveUsageGroup, 'times/day');
  panel.appendChild(microwaveUsageGroup);

  const ovenUsageGroup = document.createElement('div');
  createSlider('Oven Usage (times/day):', 0, 5, 2, 'Oven Usage', ovenUsageGroup, 'times/day');
  panel.appendChild(ovenUsageGroup);

  const pantryVolumeGroup = document.createElement('div');
  createSlider('Pantry Volume:', 50, 500, 100, 'Pantry Volume', pantryVolumeGroup, 'liters');
  panel.appendChild(pantryVolumeGroup);

  const shelfVolumeGroup = document.createElement('div');
  createSlider('Shelf Volume:', 50, 500, 100, 'Shelf Volume', shelfVolumeGroup, 'liters');
  panel.appendChild(shelfVolumeGroup);

  const drawerVolumeGroup = document.createElement('div');
  createSlider('Drawer Volume:', 50, 500, 100, 'Drawer Volume', drawerVolumeGroup, 'liters');
  panel.appendChild(drawerVolumeGroup);

  const energyUsageGroup = document.createElement('div');
  createSlider('Energy Usage Settings:', 50, 150, 100, 'Energy Usage', energyUsageGroup, '%');
  panel.appendChild(energyUsageGroup);

  const storagePreferences = ['Refrigerated', 'Frozen', 'Room Temperature'];
  createRadioGroup(storagePreferences, 'Meal Storage Preferences', panel);

  const ingredientCategories = ['Fruits', 'Vegetables', 'Proteins', 'Snacks'];
  createCheckboxGroup(ingredientCategories, 'Ingredient Categories', panel);

  const cleaningFrequencyGroup = document.createElement('div');
  createSlider('Cleaning Frequency:', 1, 7, 3, 'Cleaning Frequency', cleaningFrequencyGroup, 'times/day');
  panel.appendChild(cleaningFrequencyGroup);
}

function addExpertControls(panel: HTMLElement, cabinet: any, light: { intensity: number; }) {
  const title = createTitle('Expert Controls');
  panel.appendChild(title);

  const lightIntensityGroup = document.createElement('div');
  createSlider('Light Intensity:', 0, 5, 1, 'Light Intensity', lightIntensityGroup, 'lux');
  panel.appendChild(lightIntensityGroup);

  const timeOfDayGroup = document.createElement('div');
  createSlider('Time of Day (hours):', 0, 48, 12, 'Time of Day', timeOfDayGroup, 'hours');
  panel.appendChild(timeOfDayGroup);

  createCheckboxGroup(['Enable Seasonal Adjustments'], 'Seasonal Settings', panel);

  const wasteFrequencyGroup = document.createElement('div');
  createSlider('Waste Disposal Frequency (days):', 1, 14, 3, 'Waste Frequency', wasteFrequencyGroup, 'days');
  panel.appendChild(wasteFrequencyGroup);

  const binCapacityGroup = document.createElement('div');
  createSlider('Bin Capacity (liters):', 10, 100, 30, 'Bin Capacity', binCapacityGroup, 'liters');
  panel.appendChild(binCapacityGroup);

  const lightingBrightnessGroup = document.createElement('div');
  createSlider('Lighting Brightness (%):', 0, 100, 75, 'Lighting Brightness', lightingBrightnessGroup, '%');
  panel.appendChild(lightingBrightnessGroup);

  const colorTemperatureGroup = document.createElement('div');
  createSlider('Color Temperature (K):', 1000, 8000, 4000, 'Color Temperature', colorTemperatureGroup, 'K');
  panel.appendChild(colorTemperatureGroup);

  const applianceEfficiencyGroup = document.createElement('div');
  createSlider('Appliance Efficiency (%):', 10, 200, 100, 'Efficiency', applianceEfficiencyGroup, '%');
  panel.appendChild(applianceEfficiencyGroup);

  const roles = ['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste', 'Setting Up'];
  createCheckboxGroup(roles, 'Assign Roles', panel);

  const ventilationControls = ['On', 'Off'];
  createRadioGroup(ventilationControls, 'Ventilation Controls', panel);

  const ventilationSpeedGroup = document.createElement('div');
  createSlider('Ventilation Speed:', 0, 5, 2, 'Ventilation Speed', ventilationSpeedGroup, 'level');
  panel.appendChild(ventilationSpeedGroup);

  const recyclingRegions = ['USA', 'Japan', 'EU'];
  createRadioGroup(recyclingRegions, 'Regional Recycling Rules', panel);

  const wasteCategories = ['Compost', 'Plastic', 'Glass', 'Hazardous'];
  createCheckboxGroup(wasteCategories, 'Dynamic Waste Categories', panel);

  const roleWeightingCookingGroup = document.createElement('div');
  createSlider('Role Weighting (Cooking):', 0, 100, 70, 'Role Weighting (Cooking)', roleWeightingCookingGroup, '%');
  panel.appendChild(roleWeightingCookingGroup);

  const roleWeightingCleaningGroup = document.createElement('div');
  createSlider('Role Weighting (Cleaning):', 0, 100, 30, 'Role Weighting (Cleaning)', roleWeightingCleaningGroup, '%');
  panel.appendChild(roleWeightingCleaningGroup);

  const simulationSpeedGroup = document.createElement('div');
  createSlider('Simulation Speed:', 0.5, 5, 1, 'Simulation Speed', simulationSpeedGroup, 'x');
  panel.appendChild(simulationSpeedGroup);
}
