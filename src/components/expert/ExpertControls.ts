
import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';

export function addExpertControls(panel: HTMLElement) {
    const title = createTitle('Expert Controls');
    panel.appendChild(title);

    const lightingSection = createCollapsibleSection('Lighting Settings', panel);
    createSlider('Light Intensity:', 0, 5, 1, 'Light Intensity', lightingSection, 'lux');
    createSlider('Lighting Brightness (%):', 0, 100, 75, 'Lighting Brightness', lightingSection, '%');
    createSlider('Color Temperature (K):', 1000, 8000, 4000, 'Color Temperature', lightingSection, 'K');
    panel.appendChild(lightingSection);

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
}