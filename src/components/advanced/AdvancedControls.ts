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

function updateState(state: StoreState, updates: Partial<StoreState>): StoreState {
    return { ...state, ...updates };
}

class Store {
    private state: StoreState;

    constructor() {
        this.state = initialState;
    }

    get lightIntensity() {
        return this.state.lightIntensity;
    }
    set lightIntensity(value: number) {
        this.state = updateState(this.state, { lightIntensity: value });
    }

    get lightingBrightness() {
        return this.state.lightingBrightness;
    }
    set lightingBrightness(value: number) {
        this.state = updateState(this.state, { lightingBrightness: value });
    }

    get colorTemperature() {
        return this.state.colorTemperature;
    }
    set colorTemperature(value: number) {
        this.state = updateState(this.state, { colorTemperature: value });
    }

    get wasteFrequency() {
        return this.state.wasteFrequency;
    }
    set wasteFrequency(value: number) {
        this.state = updateState(this.state, { wasteFrequency: value });
    }

    get binCapacity() {
        return this.state.binCapacity;
    }
    set binCapacity(value: number) {
        this.state = updateState(this.state, { binCapacity: value });
    }

    get wasteCategories() {
        return this.state.wasteCategories;
    }
    set wasteCategories(value: string[]) {
        this.state = updateState(this.state, { wasteCategories: value });
    }

    get applianceEfficiency() {
        return this.state.applianceEfficiency;
    }
    set applianceEfficiency(value: number) {
        this.state = updateState(this.state, { applianceEfficiency: value });
    }

    get ventilationSpeed() {
        return this.state.ventilationSpeed;
    }
    set ventilationSpeed(value: number) {
        this.state = updateState(this.state, { ventilationSpeed: value });
    }

    get ventilationControls() {
        return this.state.ventilationControls;
    }
    set ventilationControls(value: string) {
        this.state = updateState(this.state, { ventilationControls: value });
    }

    get roles() {
        return this.state.roles;
    }
    set roles(value: string[]) {
        this.state = updateState(this.state, { roles: value });
    }

    get roleWeightingCooking() {
        return this.state.roleWeightingCooking;
    }
    set roleWeightingCooking(value: number) {
        this.state = updateState(this.state, { roleWeightingCooking: value });
    }

    get roleWeightingCleaning() {
        return this.state.roleWeightingCleaning;
    }
    set roleWeightingCleaning(value: number) {
        this.state = updateState(this.state, { roleWeightingCleaning: value });
    }

    get simulationSpeed() {
        return this.state.simulationSpeed;
    }
    set simulationSpeed(value: number) {
        this.state = updateState(this.state, { simulationSpeed: value });
    }

    get recyclingRegion() {
        return this.state.recyclingRegion;
    }
    set recyclingRegion(value: string) {
        this.state = updateState(this.state, { recyclingRegion: value });
    }
}

const store = new Store();

export function addAdvancedControls(panel: HTMLElement) {
    const title = createTitle('Advanced Controls');
    panel.appendChild(title);

    const lightingSection = createCollapsibleSection('Lighting Settings', panel);
    createSlider('Light Intensity:', 0, 5, 1, 'Light Intensity', lightingSection, 'lux');
    createSlider('Lighting Brightness (%):', 0, 100, 75, 'Lighting Brightness', lightingSection, '%');
    createSlider('Color Temperature (K):', 1000, 8000, 4000, 'Color Temperature', lightingSection, 'K');
    panel.appendChild(lightingSection);

    const feedbackSection = createCollapsibleSection('Feedback Settings', panel);
    createCheckboxGroup(['Show Real-Time Metrics'], 'User Feedback System', feedbackSection);
    panel.appendChild(feedbackSection);

    const storageSection = createCollapsibleSection('Storage Settings', panel);
    createSlider('Cabinet Width:', 1, 10, 2, 'Cabinet Width', storageSection, 'meters');
    createSlider('Cabinet Height:', 1, 3, 2, 'Cabinet Height', storageSection, 'meters');
    createSlider('Cabinet Depth:', 0.5, 2, 1, 'Cabinet Depth', storageSection, 'meters');
    createSlider('Pantry Volume:', 50, 500, 100, 'Pantry Volume', storageSection, 'liters');
    createSlider('Shelf Volume:', 50, 500, 100, 'Shelf Volume', storageSection, 'liters');
    createSlider('Drawer Volume:', 50, 500, 100, 'Drawer Volume', storageSection, 'liters');
    panel.appendChild(storageSection);

    const mealSection = createCollapsibleSection('Meal Settings', panel);
    createRadioGroup(['Cooked', 'Pre-Packaged', 'Mixed', 'Custom'], 'Meal Type', mealSection);
    createCheckboxGroup(['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo'], 'Dietary Preferences', mealSection);
    createSlider('Dishwasher Usage (times/day):', 0, 5, 1, 'Dishwasher Usage', mealSection, 'times/day');
    createSlider('Microwave Usage (times/day):', 0, 20, 5, 'Microwave Usage', mealSection, 'times/day');
    createSlider('Oven Usage (times/day):', 0, 5, 2, 'Oven Usage', mealSection, 'times/day');
    panel.appendChild(mealSection);

    const energySection = createCollapsibleSection('Energy Settings', panel);
    createSlider('Energy Usage Settings:', 50, 150, 100, 'Energy Usage', energySection, '%');
    createRadioGroup(['Refrigerated', 'Frozen', 'Room Temperature'], 'Meal Storage Preferences', energySection);
    createCheckboxGroup(['Fruits', 'Vegetables', 'Proteins', 'Snacks'], 'Ingredient Categories', energySection);
    createSlider('Cleaning Frequency:', 1, 7, 3, 'Cleaning Frequency', energySection, 'times/day');
    panel.appendChild(energySection);

    // Apply settings when inputs change
    panel.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            store.lightIntensity = parseFloat((panel.querySelector('input[name="Light Intensity"]') as HTMLInputElement).value);
            store.lightingBrightness = parseFloat((panel.querySelector('input[name="Lighting Brightness"]') as HTMLInputElement).value);
            store.colorTemperature = parseFloat((panel.querySelector('input[name="Color Temperature"]') as HTMLInputElement).value);
            applyLightingSettings({ lightingPreset: 'Advanced', lightIntensity: store.lightIntensity, lightingBrightness: store.lightingBrightness, colorTemperature: store.colorTemperature });

            store.wasteFrequency = parseInt((panel.querySelector('input[name="Waste Frequency"]') as HTMLInputElement).value);
            store.binCapacity = parseInt((panel.querySelector('input[name="Bin Capacity"]') as HTMLInputElement).value);
            store.wasteCategories = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked'))
                .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                .filter((text): text is string => text !== null && text !== undefined);
            applyWasteSettings({ wasteFrequency: store.wasteFrequency, binCapacity: store.binCapacity, wasteCategories: store.wasteCategories });

            store.applianceEfficiency = parseInt((panel.querySelector('input[name="Efficiency"]') as HTMLInputElement).value);
            store.ventilationSpeed = parseInt((panel.querySelector('input[name="Ventilation Speed"]') as HTMLInputElement).value);
            store.ventilationControls = (panel.querySelector('input[name="Ventilation Controls"]:checked') as HTMLInputElement).value;
            applyApplianceSettings({ applianceEfficiency: store.applianceEfficiency, ventilationSpeed: store.ventilationSpeed, ventilationControls: store.ventilationControls });

            store.roles = Array.from(panel.querySelectorAll('input[name="Assign Roles"]:checked'))
                .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                .filter((text): text is string => text !== null && text !== undefined);
            store.roleWeightingCooking = parseInt((panel.querySelector('input[name="Role Weighting (Cooking)"]') as HTMLInputElement).value);
            store.roleWeightingCleaning = parseInt((panel.querySelector('input[name="Role Weighting (Cleaning)"]') as HTMLInputElement).value);
            applyRoleSettings({ roles: store.roles, roleWeightingCooking: store.roleWeightingCooking, roleWeightingCleaning: store.roleWeightingCleaning });

            store.simulationSpeed = parseFloat((panel.querySelector('input[name="Simulation Speed"]') as HTMLInputElement).value);
            store.recyclingRegion = (panel.querySelector('input[name="Regional Recycling Rules"]:checked') as HTMLInputElement).value;
            applySimulationSettings({ simulationSpeed: store.simulationSpeed, recyclingRegion: store.recyclingRegion });
        });
    });
}

export function getStore() {
    return store;
}