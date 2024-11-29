import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';
import { applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings } from '../../models';

interface StoreState {
    timeOfDay: number;
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
    timeOfDay: 12,
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

    get timeOfDay() {
        return this.state.timeOfDay;
    }
    set timeOfDay(value: number) {
        this.state = updateState(this.state, { timeOfDay: value });
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

export function addExpertControls(panel: HTMLElement) {
    const title = createTitle('Expert Controls');
    panel.appendChild(title);

    const timeSection = createCollapsibleSection('Time Settings', panel);
    createSlider('Time of Day (hours):', 0, 48, 12, 'Time of Day', timeSection, 'hours');
    createCheckboxGroup(['Enable Seasonal Adjustments'], 'Seasonal Settings', timeSection);
    panel.appendChild(timeSection);

    const wasteSection = createCollapsibleSection('Waste Settings', panel);
    createSlider('Waste Disposal Frequency (days):', 1, 14, 3, 'Waste Frequency', wasteSection, 'days');
    createSlider('Bin Capacity (liters):', 10, 100, 30, 'Bin Capacity', wasteSection, 'liters');
    createCheckboxGroup(['Compost', 'Plastic', 'Glass', 'Hazardous'], 'Dynamic Waste Categories', wasteSection);
    panel.appendChild(wasteSection);

    const applianceSection = createCollapsibleSection('Appliance Settings', panel);
    createSlider('Appliance Efficiency (%):', 10, 200, 100, 'Efficiency', applianceSection, '%');
    createRadioGroup(['On', 'Off'], 'Ventilation Controls', applianceSection);
    createSlider('Ventilation Speed:', 0, 5, 2, 'Ventilation Speed', applianceSection, 'level');
    panel.appendChild(applianceSection);

    const roleSection = createCollapsibleSection('Role Settings', panel);
    createCheckboxGroup(['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste', 'Setting Up'], 'Assign Roles', roleSection);
    createSlider('Role Weighting (Cooking):', 0, 100, 70, 'Role Weighting (Cooking)', roleSection, '%');
    createSlider('Role Weighting (Cleaning):', 0, 100, 30, 'Role Weighting (Cleaning)', roleSection, '%');
    panel.appendChild(roleSection);

    const simulationSection = createCollapsibleSection('Simulation Settings', panel);
    createSlider('Simulation Speed:', 0.5, 5, 1, 'Simulation Speed', simulationSection, 'x');
    createRadioGroup(['USA', 'Japan', 'EU'], 'Regional Recycling Rules', simulationSection);
    panel.appendChild(simulationSection);

    // Apply settings when inputs change
    panel.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            store.timeOfDay = parseFloat((panel.querySelector('input[name="Time of Day"]') as HTMLInputElement).value);
            store.wasteFrequency = parseInt((panel.querySelector('input[name="Waste Frequency"]') as HTMLInputElement).value);
            store.binCapacity = parseInt((panel.querySelector('input[name="Bin Capacity"]') as HTMLInputElement).value);
            store.wasteCategories = Array.from(panel.querySelectorAll('input[name="Dynamic Waste Categories"]:checked'))
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