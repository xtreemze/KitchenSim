import { createSlider, createCheckboxGroup, createTitle, createToggleButton, createCollapsibleSection } from '../../guiHelpers';
import { applyRoomDimensions, applyMealSettings, applyEnergySettings, applyLightingSettings, applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings } from '../../models';

export function addBasicControls(panel: HTMLElement) {
    const title = createTitle('Basic Controls');
    panel.appendChild(title);

    const simulateButton = createToggleButton('Simulate Kitchen', () => {
        const familySize = parseInt((panel.querySelector('input[name="Family Size"]') as HTMLInputElement).value);
        const groceryFrequency = parseInt((panel.querySelector('input[name="Grocery Frequency"]') as HTMLInputElement).value);
        const mealPrepFrequency = parseInt((panel.querySelector('input[name="Meal Prep Frequency"]') as HTMLInputElement).value);
        const cookingFrequency = parseInt((panel.querySelector('input[name="Cooking Frequency"]') as HTMLInputElement).value);
        const appliancesEnabled = Array.from(panel.querySelectorAll('input[type="checkbox"]'))
            .filter((checkbox) => (checkbox as HTMLInputElement).checked)
            .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
            .filter((text): text is string => text !== null && text !== undefined);

        console.log('Simulating Kitchen with the following settings:');
        console.log('Family Size:', familySize);
        console.log('Grocery Trip Frequency:', groceryFrequency);
        console.log('Meal Prep Frequency:', mealPrepFrequency);
        console.log('Cooking Frequency:', cookingFrequency);
        console.log('Appliances Enabled:', appliancesEnabled);

        // Send the gathered state to the mathematical models
        applyRoomDimensions({ width: 10, length: 10, height: 3 }); // Example values
        applyMealSettings({ familySize, groceryFrequency, mealPrepFrequency, cookingFrequency });
        applyEnergySettings({ appliancesEnabled });
        applyLightingSettings({ lightingPreset: 'Default', lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 }); // Example values
        applyWasteSettings({ wasteFrequency: 3, binCapacity: 30, wasteCategories: ['Compost', 'Plastic'] }); // Example values
        applyApplianceSettings({ applianceEfficiency: 100, ventilationSpeed: 2, ventilationControls: 'On' }); // Example values
        applyRoleSettings({ roles: ['Cooking', 'Cleaning'], roleWeightingCooking: 70, roleWeightingCleaning: 30 }); // Example values
        applySimulationSettings({ simulationSpeed: 1, recyclingRegion: 'USA' }); // Example values
    });
    panel.appendChild(simulateButton);

    const familySection = createCollapsibleSection('Family Settings', panel);
    createSlider('Family Size:', 1, 12, 4, 'Family Size', familySection, 'people');
    createSlider('Grocery Trip Frequency:', 1, 21, 3, 'Grocery Frequency', familySection, 'days');
    createSlider('Meal Prep Frequency:', 1, 7, 2, 'Meal Prep Frequency', familySection, 'times/week');
    createSlider('Cooking Frequency:', 1, 10, 3, 'Cooking Frequency', familySection, 'meals/day');
    panel.appendChild(familySection);

    const roomSection = createCollapsibleSection('Room Dimensions', panel);
    createSlider('Room Width:', 2, 20, 10, 'Room Width', roomSection, 'meters');
    createSlider('Room Length:', 2, 20, 10, 'Room Length', roomSection, 'meters');
    createSlider('Ceiling Height:', 2, 5, 3, 'Ceiling Height', roomSection, 'meters');
    panel.appendChild(roomSection);

    const applianceSection = createCollapsibleSection('Appliance Settings', panel);
    const appliances = ['Dishwasher', 'Microwave', 'Oven', 'Blender', 'Toaster'];
    createCheckboxGroup(appliances, 'Appliances Enabled', applianceSection);
    panel.appendChild(applianceSection);
}