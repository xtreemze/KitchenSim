import {
    applyApplianceSettings,
    applyCabinetAnimationSettings,
    applyLightingSettings,
    applyWasteSettings,
    setMetricsVisibility
} from '../../models';
import {
    createCheckboxGroup,
    createCollapsibleSection,
    createRadioGroup,
    createSlider,
    createTitle
} from '../../guiHelpers';
import { WasteCategory } from '../../simulation/types';

interface StoreState {
    lightIntensity: number;
    lightingBrightness: number;
    colorTemperature: number;
    wasteFrequency: number;
    binCapacity: number;
    wasteCategories: WasteCategory[];
    applianceEfficiency: number;
    ventilationSpeed: number;
    ventilationEnabled: boolean;
    openDoorDrawerAnimation: boolean;
    showMetrics: boolean;
}

const initialState: StoreState = {
    lightIntensity: 1,
    lightingBrightness: 75,
    colorTemperature: 4000,
    wasteFrequency: 3,
    binCapacity: 30,
    wasteCategories: ['Compost', 'Plastic', 'Glass', 'Paper', 'Metal', 'Hazardous'],
    applianceEfficiency: 100,
    ventilationSpeed: 2,
    ventilationEnabled: false,
    openDoorDrawerAnimation: true,
    showMetrics: true
};

class Store {
    private state: StoreState = { ...initialState, wasteCategories: [...initialState.wasteCategories] };

    getState(): StoreState {
        return { ...this.state, wasteCategories: [...this.state.wasteCategories] };
    }

    updateState(updates: Partial<StoreState>): void {
        this.state = {
            ...this.state,
            ...updates,
            wasteCategories: updates.wasteCategories
                ? [...updates.wasteCategories]
                : [...this.state.wasteCategories]
        };
    }
}

const advancedStore = new Store();

export function addAdvancedControls(panel: HTMLElement): void {
    panel.appendChild(createTitle('Advanced Controls'));

    const lightingSection = createCollapsibleSection('Lighting', panel);
    const lightIntensity = createSlider('Light Intensity', 0, 5, initialState.lightIntensity, lightingSection, 'x');
    const lightingBrightness = createSlider('Lighting Brightness', 0, 100, initialState.lightingBrightness, lightingSection, '%');
    const colorTemperature = createSlider('Color Temperature', 2000, 8000, initialState.colorTemperature, lightingSection, 'K');

    const wasteSection = createCollapsibleSection('Waste & sorting', panel);
    const wasteFrequency = createSlider('Waste Disposal Frequency', 1, 14, initialState.wasteFrequency, wasteSection, 'days');
    const binCapacity = createSlider('Bin Capacity', 10, 100, initialState.binCapacity, wasteSection, 'L');
    const wasteInputs = createCheckboxGroup(
        ['Compost', 'Plastic', 'Glass', 'Paper', 'Metal', 'Hazardous'],
        'Sorted Waste Streams',
        wasteSection,
        initialState.wasteCategories
    );

    const applianceSection = createCollapsibleSection('Efficiency & ventilation', panel);
    const applianceEfficiency = createSlider('Appliance Efficiency', 10, 200, initialState.applianceEfficiency, applianceSection, '%');
    const ventilationSpeed = createSlider('Ventilation Speed', 0, 5, initialState.ventilationSpeed, applianceSection, 'level');
    const ventilationControls = createRadioGroup(['Off', 'On'], 'Ventilation Controls', applianceSection, 'Off');

    const feedbackSection = createCollapsibleSection('Feedback & animation', panel);
    const animationInput = createCheckboxGroup(
        ['Open Door and Drawer Animation'],
        'Cabinet Animation',
        feedbackSection,
        ['Open Door and Drawer Animation']
    )[0];
    const metricsInput = createCheckboxGroup(
        ['Show Real-Time Metrics'],
        'Telemetry',
        feedbackSection,
        ['Show Real-Time Metrics']
    )[0];

    const sync = (): void => {
        const selectedVentilation = ventilationControls.find((input) => input.checked)?.value ?? 'Off';
        const state: StoreState = {
            lightIntensity: Number(lightIntensity.value),
            lightingBrightness: Number(lightingBrightness.value),
            colorTemperature: Number(colorTemperature.value),
            wasteFrequency: Number(wasteFrequency.value),
            binCapacity: Number(binCapacity.value),
            wasteCategories: wasteInputs.filter((input) => input.checked).map((input) => input.value as WasteCategory),
            applianceEfficiency: Number(applianceEfficiency.value),
            ventilationSpeed: Number(ventilationSpeed.value),
            ventilationEnabled: selectedVentilation === 'On',
            openDoorDrawerAnimation: animationInput.checked,
            showMetrics: metricsInput.checked
        };
        advancedStore.updateState(state);
        applyLightingSettings({
            lightingPreset: 'Advanced',
            lightIntensity: state.lightIntensity,
            lightingBrightness: state.lightingBrightness,
            colorTemperature: state.colorTemperature
        });
        applyWasteSettings({
            wasteFrequency: state.wasteFrequency,
            binCapacity: state.binCapacity,
            wasteCategories: state.wasteCategories
        });
        applyApplianceSettings({
            applianceEfficiency: state.applianceEfficiency,
            ventilationSpeed: state.ventilationSpeed,
            ventilationControls: state.ventilationEnabled ? 'On' : 'Off'
        });
        applyCabinetAnimationSettings({ openDoorDrawerAnimation: state.openDoorDrawerAnimation });
        setMetricsVisibility(state.showMetrics);
    };

    [lightIntensity, lightingBrightness, colorTemperature, wasteFrequency, binCapacity, applianceEfficiency, ventilationSpeed]
        .forEach((input) => input.addEventListener('input', sync));
    [...wasteInputs, ...ventilationControls, animationInput, metricsInput]
        .forEach((input) => input.addEventListener('change', sync));

    sync();
}

export function getStore(): Store {
    return advancedStore;
}
