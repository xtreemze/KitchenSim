import { setDimensions } from '../../app/roomStore';
import { createSlider, createCheckboxGroup, createTitle, createToggleButton, createCollapsibleSection } from '../../guiHelpers';
import { applyRoomDimensions, applyMealSettings, applyEnergySettings, applyLightingSettings, applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings } from '../../models';

interface StoreState {
    familySize: number;
    groceryFrequency: number;
    mealPrepFrequency: number;
    cookingFrequency: number;
    roomWidth: number;
    roomLength: number;
    ceilingHeight: number;
    appliancesEnabled: string[];
}

const initialState: StoreState = {
    familySize: 4,
    groceryFrequency: 3,
    mealPrepFrequency: 2,
    cookingFrequency: 3,
    roomWidth: 10,
    roomLength: 10,
    ceilingHeight: 3,
    appliancesEnabled: []
};

class Store {
    private state: StoreState;

    constructor() {
        this.state = initialState;
    }

    getState() {
        return { ...this.state };
    }

    updateState(updates: Partial<StoreState>) {
        this.state = { ...this.state, ...updates };
    }
}

export const basicStore = new Store();

export function addBasicControls(panel: HTMLElement) {
    const title = createTitle('Basic Controls');
    panel.appendChild(title);

    const simulateButton = createToggleButton('Simulate Kitchen', () => {
        const state = basicStore.getState();
        applyRoomDimensions({ width: state.roomWidth, length: state.roomLength, height: state.ceilingHeight });
        applyMealSettings({ familySize: state.familySize, groceryFrequency: state.groceryFrequency, mealPrepFrequency: state.mealPrepFrequency, cookingFrequency: state.cookingFrequency });
        applyEnergySettings({ appliancesEnabled: state.appliancesEnabled });
        applyLightingSettings({ lightingPreset: 'Default', lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 }); // Example values
        applyWasteSettings({ wasteFrequency: 3, binCapacity: 30, wasteCategories: ['Compost', 'Plastic'] }); // Example values
        applyApplianceSettings({ applianceEfficiency: 100, ventilationSpeed: 2, ventilationControls: 'On' }); // Example values
        applyRoleSettings({ roles: ['Cooking', 'Cleaning'], roleWeightingCooking: 70, roleWeightingCleaning: 30 }); // Example values
        applySimulationSettings({ simulationSpeed: 1, recyclingRegion: 'USA' }); // Example values
    });
    panel.appendChild(simulateButton);

    const familySection = createCollapsibleSection('Family Settings', panel);
    createSlider('Family Size', 1, 12, 4, familySection, 'people');
    createSlider('Grocery Trip Frequency', 1, 21, 3, familySection, 'days');
    createSlider('Meal Prep Frequency', 1, 7, 2, familySection, 'times/week');
    createSlider('Cooking Frequency', 1, 10, 3, familySection, 'meals/day');
    panel.appendChild(familySection);

    const roomSection = createCollapsibleSection('Room Dimensions', panel);
    createSlider('Room Width', 4, 40, 25, roomSection, 'meters');
    createSlider('Room Length', 4, 40, 25, roomSection, 'meters');
    createSlider('Ceiling Height', 3, 15, 4, roomSection, 'meters');
    panel.appendChild(roomSection);

    const applianceSection = createCollapsibleSection('Appliance Settings', panel);
    const appliances = ['Dishwasher', 'Microwave', 'Oven', 'Blender', 'Toaster'];
    createCheckboxGroup(appliances, 'Appliances Enabled', applianceSection);
    panel.appendChild(applianceSection);

    // Apply settings when inputs change
    panel.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            const updates: Partial<StoreState> = {};

            switch (target.id) {
                case 'slider-family-size':
                    updates.familySize = parseInt(target.value);
                    break;
                case 'slider-grocery-trip-frequency':
                    updates.groceryFrequency = parseInt(target.value);
                    break;
                case 'slider-meal-prep-frequency':
                    updates.mealPrepFrequency = parseInt(target.value);
                    break;
                case 'slider-cooking-frequency':
                    updates.cookingFrequency = parseInt(target.value);
                    break;
                case 'slider-room-width':
                    updates.roomWidth = parseInt(target.value);
                    setDimensions(updates.roomWidth, basicStore.getState().roomLength);
                    break;
                case 'slider-room-length':
                    updates.roomLength = parseInt(target.value);
                    setDimensions(basicStore.getState().roomWidth, updates.roomLength);
                    break;
                case 'slider-ceiling-height':
                    updates.ceilingHeight = parseInt(target.value);
                    break;
                default:
                    if (target.name === 'checkbox-appliances-enabled') {
                        updates.appliancesEnabled = Array.from(document.querySelectorAll('input#checkbox-appliances-enabled:checked'))
                            .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                            .filter((text): text is string => text !== null && text !== undefined);
                    }
                    break;
            }

            basicStore.updateState(updates);

            const state = basicStore.getState();
            applyRoomDimensions({ width: state.roomWidth, length: state.roomLength, height: state.ceilingHeight });
            applyMealSettings({ familySize: state.familySize, groceryFrequency: state.groceryFrequency, mealPrepFrequency: state.mealPrepFrequency, cookingFrequency: state.cookingFrequency });
            applyEnergySettings({ appliancesEnabled: state.appliancesEnabled });
            applyLightingSettings({ lightingPreset: 'Default', lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 }); // Example values
            applyWasteSettings({ wasteFrequency: 3, binCapacity: 30, wasteCategories: ['Compost', 'Plastic'] }); // Example values
            applyApplianceSettings({ applianceEfficiency: 100, ventilationSpeed: 2, ventilationControls: 'On' }); // Example values
            applyRoleSettings({ roles: ['Cooking', 'Cleaning'], roleWeightingCooking: 70, roleWeightingCleaning: 30 }); // Example values
            applySimulationSettings({ simulationSpeed: 1, recyclingRegion: 'USA' }); // Example values
        });
    });
}