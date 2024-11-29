import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';
import { applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings, getTimeOfDay } from '../../models';

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

const expertStore = new Store();

export function addExpertControls(panel: HTMLElement) {
    const title = createTitle('Expert Controls');
    panel.appendChild(title);

    const timeSection = createCollapsibleSection('Time Settings', panel);
    createSlider('Time of Day', 0, 24, 12, timeSection, 'hours');
    createCheckboxGroup(['Enable Seasonal Adjustments'], 'Seasonal Settings', timeSection);
    panel.appendChild(timeSection);

    const wasteSection = createCollapsibleSection('Waste Settings', panel);
    createSlider('Waste Disposal Frequency', 1, 14, 3, wasteSection, 'days');
    createSlider('Bin Capacity', 10, 100, 30, wasteSection, 'liters');
    createCheckboxGroup(['Compost', 'Plastic', 'Glass', 'Hazardous'], 'Dynamic Waste Categories', wasteSection);
    panel.appendChild(wasteSection);

    const applianceSection = createCollapsibleSection('Appliance Settings', panel);
    createSlider('Appliance Efficiency', 10, 200, 100, applianceSection, '%');
    createRadioGroup(['On', 'Off'], 'Ventilation Controls', applianceSection);
    createSlider('Ventilation Speed', 0, 5, 2, applianceSection, 'level');
    panel.appendChild(applianceSection);

    const roleSection = createCollapsibleSection('Role Settings', panel);
    createCheckboxGroup(['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste', 'Setting Up'], 'Assign Roles', roleSection);
    createSlider('Role Weighting (Cooking)', 0, 100, 70, roleSection, '%');
    createSlider('Role Weighting (Cleaning)', 0, 100, 30, roleSection, '%');
    panel.appendChild(roleSection);

    const simulationSection = createCollapsibleSection('Simulation Settings', panel);
    createSlider('Simulation Speed', 0.5, 5, 1, simulationSection, 'x');
    createRadioGroup(['USA', 'Japan', 'EU'], 'Regional Recycling Rules', simulationSection);
    panel.appendChild(simulationSection);

    // Apply settings when inputs change
    panel.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            const updates: Partial<StoreState> = {};

            switch (target.id) {
                case 'slider-time-of-day':
                    updates.timeOfDay = parseInt(target.value);
                    break;
                case 'slider-waste-disposal-frequency':
                    updates.wasteFrequency = parseInt(target.value);
                    break;
                case 'slider-bin-capacity-liters':
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

            expertStore.updateState(updates);

            const state = expertStore.getState();
            applyWasteSettings({ wasteFrequency: state.wasteFrequency, binCapacity: state.binCapacity, wasteCategories: state.wasteCategories });
            applyApplianceSettings({ applianceEfficiency: state.applianceEfficiency, ventilationSpeed: state.ventilationSpeed, ventilationControls: state.ventilationControls });
            applyRoleSettings({ roles: state.roles, roleWeightingCooking: state.roleWeightingCooking, roleWeightingCleaning: state.roleWeightingCleaning });
            applySimulationSettings({ simulationSpeed: state.simulationSpeed, recyclingRegion: state.recyclingRegion });

            if (target.id === 'slider-time-of-day') {
                getTimeOfDay();
            }
        });
    });
}

export function getStore() {
    return expertStore;
}