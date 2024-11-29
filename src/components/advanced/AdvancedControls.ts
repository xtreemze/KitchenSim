import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';
import { applyLightingSettings, applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings } from '../../models';

interface StoreState {
    lightIntensity: number;
    lightingBrightness: number;
    colorTemperature: number;
    wasteFrequency: number;
    binCapacity: number;
    wasteCategories: string[];
    applianceEfficiency: number;
    ventilationSpeed: number;
    ventilationControls: string;
    roles: string[];
    roleWeightingCooking: number;
    roleWeightingCleaning: number;
    simulationSpeed: number;
    recyclingRegion: string;
}

const initialState: StoreState = {
    lightIntensity: 1,
    lightingBrightness: 75,
    colorTemperature: 4000,
    wasteFrequency: 3,
    binCapacity: 30,
    wasteCategories: [],
    applianceEfficiency: 100,
    ventilationSpeed: 2,
    ventilationControls: 'Off',
    roles: [],
    roleWeightingCooking: 70,
    roleWeightingCleaning: 30,
    simulationSpeed: 1,
    recyclingRegion: 'USA'
};

class Store {
    private state: StoreState;

    constructor() {
        this.state = initialState;
    }

    getState() {
        return this.state;
    }

    updateState(updates: Partial<StoreState>) {
        this.state = { ...this.state, ...updates };
    }
}

const advancedStore = new Store();

export function addAdvancedControls(panel: HTMLElement) {
    const title = createTitle('Advanced Controls');
    panel.appendChild(title);

    const lightingSection = createCollapsibleSection('Lighting Settings', panel);
    createSlider('Light Intensity', 0, 5, 1, lightingSection, 'lux');
    createSlider('Lighting Brightness', 0, 100, 75, lightingSection, '%');
    createSlider('Color Temperature', 1000, 8000, 4000, lightingSection, 'K');
    panel.appendChild(lightingSection);

    const feedbackSection = createCollapsibleSection('Feedback Settings', panel);
    createCheckboxGroup(['Show Real-Time Metrics'], 'User Feedback System', feedbackSection);
    panel.appendChild(feedbackSection);

    const storageSection = createCollapsibleSection('Storage Settings', panel);
    createSlider('Cabinet Width', 1, 10, 2, storageSection, 'meters');
    createSlider('Cabinet Height', 1, 3, 2, storageSection, 'meters');
    createSlider('Cabinet Depth', 0.5, 2, 1, storageSection, 'meters');
    createSlider('Pantry Volume', 50, 500, 100, storageSection, 'liters');
    createSlider('Shelf Volume', 50, 500, 100, storageSection, 'liters');
    createSlider('Drawer Volume', 50, 500, 100, storageSection, 'liters');
    panel.appendChild(storageSection);

    const mealSection = createCollapsibleSection('Meal Settings', panel);
    createRadioGroup(['Cooked', 'Pre-Packaged', 'Mixed', 'Custom'], 'Meal Type', mealSection);
    createCheckboxGroup(['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'], 'Dietary Preferences', mealSection);
    createSlider('Dishwasher Usage', 0, 5, 1, mealSection, 'times/day');
    createSlider('Microwave Usage', 0, 20, 5, mealSection, 'times/day');
    createSlider('Oven Usage', 0, 5, 2, mealSection, 'times/day');
    panel.appendChild(mealSection);

    const energySection = createCollapsibleSection('Energy Settings', panel);
    createSlider('Energy Usage Settings', 50, 150, 100, energySection, '%');
    createRadioGroup(['Refrigerated', 'Frozen', 'Room Temperature'], 'Meal Storage Preferences', energySection);
    createCheckboxGroup(['Fruits', 'Vegetables', 'Proteins', 'Snacks'], 'Ingredient Categories', energySection);
    createSlider('Cleaning Frequency', 1, 7, 3, energySection, 'times/day');
    panel.appendChild(energySection);

    // Apply settings when inputs change
    panel.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            const updates: Partial<StoreState> = {};

            switch (target.id) {
                case 'slider-light-intensity':
                    updates.lightIntensity = parseFloat(target.value);
                    break;
                case 'slider-lighting-brightness':
                    updates.lightingBrightness = parseFloat(target.value);
                    break;
                case 'slider-color-temperature':
                    updates.colorTemperature = parseFloat(target.value);
                    break;
                case 'slider-waste-frequency':
                    updates.wasteFrequency = parseInt(target.value);
                    break;
                case 'slider-bin-capacity':
                    updates.binCapacity = parseInt(target.value);
                    break;
                case 'slider-appliance-efficiency':
                    updates.applianceEfficiency = parseInt(target.value);
                    break;
                case 'slider-ventilation-speed':
                    updates.ventilationSpeed = parseInt(target.value);
                    break;
                case 'slider-role-weighting-cooking':
                    updates.roleWeightingCooking = parseInt(target.value);
                    break;
                case 'slider-role-weighting-cleaning':
                    updates.roleWeightingCleaning = parseInt(target.value);
                    break;
                case 'slider-simulation-speed':
                    updates.simulationSpeed = parseFloat(target.value);
                    break;
                default:
                    if (target.name === 'radio-regional-recycling-rules') {
                        updates.recyclingRegion = target.value;
                    } else if (target.name === 'checkbox-dynamic-waste-categories') {
                        updates.wasteCategories = Array.from(document.querySelectorAll('input#checkbox-dynamic-waste-categories:checked'))
                            .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                            .filter((text): text is string => text !== null && text !== undefined);
                    } else if (target.name === 'checkbox-assign-roles') {
                        updates.roles = Array.from(document.querySelectorAll('input#checkbox-assign-roles:checked'))
                            .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                            .filter((text): text is string => text !== null && text !== undefined);
                    } else if (target.name === 'radio-ventilation-controls') {
                        updates.ventilationControls = target.value;
                    }
                    break;
            }

            advancedStore.updateState(updates);

            const state = advancedStore.getState();
            applyLightingSettings({ lightingPreset: 'Advanced', lightIntensity: state.lightIntensity, lightingBrightness: state.lightingBrightness, colorTemperature: state.colorTemperature });
            applyWasteSettings({ wasteFrequency: state.wasteFrequency, binCapacity: state.binCapacity, wasteCategories: state.wasteCategories });
            applyApplianceSettings({ applianceEfficiency: state.applianceEfficiency, ventilationSpeed: state.ventilationSpeed, ventilationControls: state.ventilationControls });
            applyRoleSettings({ roles: state.roles, roleWeightingCooking: state.roleWeightingCooking, roleWeightingCleaning: state.roleWeightingCleaning });
            applySimulationSettings({ simulationSpeed: state.simulationSpeed, recyclingRegion: state.recyclingRegion });
        });
    });
}

export function getStore() {
    return advancedStore;
}