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
        const roomWidth = parseInt((panel.querySelector('input[name="Room Width"]') as HTMLInputElement).value);
        const roomLength = parseInt((panel.querySelector('input[name="Room Length"]') as HTMLInputElement).value);
        const ceilingHeight = parseInt((panel.querySelector('input[name="Ceiling Height"]') as HTMLInputElement).value);
        const appliancesEnabled = Array.from(panel.querySelectorAll('input[type="checkbox"]'))
            .filter((checkbox) => (checkbox as HTMLInputElement).checked)
            .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
            .filter((text): text is string => text !== null && text !== undefined);

        // Send the gathered state to the mathematical models
        applyRoomDimensions({ width: roomWidth, length: roomLength, height: ceilingHeight });
        applyMealSettings({ familySize, groceryFrequency, mealPrepFrequency, cookingFrequency });
        applyEnergySettings({ appliancesEnabled });
        applyLightingSettings({ lightingPreset: 'Default', lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 }); // Example values
        applyWasteSettings({ wasteFrequency: 3, binCapacity: 30, wasteCategories: ['Compost', 'Plastic'] }); // Example values
        applyApplianceSettings({ applianceEfficiency: 100, ventilationSpeed: 2, ventilationControls: 'On' }); // Example values
        applyRoleSettings({ roles: ['Cooking', 'Cleaning'], roleWeightingCooking: 70, roleWeightingCleaning: 30 }); // Example values
        applySimulationSettings({ simulationSpeed: 1, recyclingRegion: 'USA' }); // Example values

        // Add event listeners to update the settings when inputs change
        panel.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                const updatedFamilySize = parseInt((panel.querySelector('input[name="Family Size"]') as HTMLInputElement).value);
                const updatedGroceryFrequency = parseInt((panel.querySelector('input[name="Grocery Frequency"]') as HTMLInputElement).value);
                const updatedMealPrepFrequency = parseInt((panel.querySelector('input[name="Meal Prep Frequency"]') as HTMLInputElement).value);
                const updatedCookingFrequency = parseInt((panel.querySelector('input[name="Cooking Frequency"]') as HTMLInputElement).value);
                const updatedRoomWidth = parseInt((panel.querySelector('input[name="Room Width"]') as HTMLInputElement).value);
                const updatedRoomLength = parseInt((panel.querySelector('input[name="Room Length"]') as HTMLInputElement).value);
                const updatedCeilingHeight = parseInt((panel.querySelector('input[name="Ceiling Height"]') as HTMLInputElement).value);
                const updatedAppliancesEnabled = Array.from(panel.querySelectorAll('input[type="checkbox"]'))
                    .filter((checkbox) => (checkbox as HTMLInputElement).checked)
                    .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                    .filter((text): text is string => text !== null && text !== undefined);

                applyRoomDimensions({ width: updatedRoomWidth, length: updatedRoomLength, height: updatedCeilingHeight });
                applyMealSettings({ familySize: updatedFamilySize, groceryFrequency: updatedGroceryFrequency, mealPrepFrequency: updatedMealPrepFrequency, cookingFrequency: updatedCookingFrequency });
                applyEnergySettings({ appliancesEnabled: updatedAppliancesEnabled });
                applyLightingSettings({ lightingPreset: 'Default', lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 }); // Example values
                applyWasteSettings({ wasteFrequency: 3, binCapacity: 30, wasteCategories: ['Compost', 'Plastic'] }); // Example values
                applyApplianceSettings({ applianceEfficiency: 100, ventilationSpeed: 2, ventilationControls: 'On' }); // Example values
                applyRoleSettings({ roles: ['Cooking', 'Cleaning'], roleWeightingCooking: 70, roleWeightingCleaning: 30 }); // Example values
                applySimulationSettings({ simulationSpeed: 1, recyclingRegion: 'USA' }); // Example values
            });
        });
        // Debounce function to limit the rate at which a function can fire
        function debounce(this: void, func: Function, wait: number) {
            let timeout: number | undefined;
            return (...args: any[]) => {
                clearTimeout(timeout);
                timeout = window.setTimeout(() => func.apply(this, args), wait);
            };
        }

        // Debounced function to apply settings
        const debouncedApplySettings = debounce(() => {
            const updatedFamilySize = parseInt((panel.querySelector('input[name="Family Size"]') as HTMLInputElement).value);
            const updatedGroceryFrequency = parseInt((panel.querySelector('input[name="Grocery Frequency"]') as HTMLInputElement).value);
            const updatedMealPrepFrequency = parseInt((panel.querySelector('input[name="Meal Prep Frequency"]') as HTMLInputElement).value);
            const updatedCookingFrequency = parseInt((panel.querySelector('input[name="Cooking Frequency"]') as HTMLInputElement).value);
            const updatedRoomWidth = parseInt((panel.querySelector('input[name="Room Width"]') as HTMLInputElement).value);
            const updatedRoomLength = parseInt((panel.querySelector('input[name="Room Length"]') as HTMLInputElement).value);
            const updatedCeilingHeight = parseInt((panel.querySelector('input[name="Ceiling Height"]') as HTMLInputElement).value);
            const updatedAppliancesEnabled = Array.from(panel.querySelectorAll('input[type="checkbox"]'))
                .filter((checkbox) => (checkbox as HTMLInputElement).checked)
                .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                .filter((text): text is string => text !== null && text !== undefined);

            applyRoomDimensions({ width: updatedRoomWidth, length: updatedRoomLength, height: updatedCeilingHeight });
            applyMealSettings({ familySize: updatedFamilySize, groceryFrequency: updatedGroceryFrequency, mealPrepFrequency: updatedMealPrepFrequency, cookingFrequency: updatedCookingFrequency });
            applyEnergySettings({ appliancesEnabled: updatedAppliancesEnabled });
            applyLightingSettings({ lightingPreset: 'Default', lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 }); // Example values
            applyWasteSettings({ wasteFrequency: 3, binCapacity: 30, wasteCategories: ['Compost', 'Plastic'] }); // Example values
            applyApplianceSettings({ applianceEfficiency: 100, ventilationSpeed: 2, ventilationControls: 'On' }); // Example values
            applyRoleSettings({ roles: ['Cooking', 'Cleaning'], roleWeightingCooking: 70, roleWeightingCleaning: 30 }); // Example values
            applySimulationSettings({ simulationSpeed: 1, recyclingRegion: 'USA' }); // Example values
        }, 300);

        // Add event listeners to update the settings when inputs change
        panel.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', debouncedApplySettings);
        });
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