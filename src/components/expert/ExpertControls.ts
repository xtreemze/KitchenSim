import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';
import { applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings } from '../../models';

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
            const wasteFrequency = parseInt((panel.querySelector('input[name="Waste Frequency"]') as HTMLInputElement).value);
            const binCapacity = parseInt((panel.querySelector('input[name="Bin Capacity"]') as HTMLInputElement).value);
            const wasteCategories = Array.from(panel.querySelectorAll('input[type="checkbox"]'))
                .filter((checkbox) => (checkbox as HTMLInputElement).checked)
                .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                .filter((text): text is string => text !== null && text !== undefined);
            applyWasteSettings({ wasteFrequency, binCapacity, wasteCategories });

            const applianceEfficiency = parseInt((panel.querySelector('input[name="Efficiency"]') as HTMLInputElement).value);
            const ventilationSpeed = parseInt((panel.querySelector('input[name="Ventilation Speed"]') as HTMLInputElement).value);
            const ventilationControls = (panel.querySelector('input[name="Ventilation Controls"]:checked') as HTMLInputElement).value;
            applyApplianceSettings({ applianceEfficiency, ventilationSpeed, ventilationControls });

            const roles = Array.from(panel.querySelectorAll('input[name="Assign Roles"]:checked'))
                .map((checkbox) => (checkbox as HTMLInputElement).nextElementSibling?.textContent)
                .filter((text): text is string => text !== null && text !== undefined);
            const roleWeightingCooking = parseInt((panel.querySelector('input[name="Role Weighting (Cooking)"]') as HTMLInputElement).value);
            const roleWeightingCleaning = parseInt((panel.querySelector('input[name="Role Weighting (Cleaning)"]') as HTMLInputElement).value);
            applyRoleSettings({ roles, roleWeightingCooking, roleWeightingCleaning });

            const simulationSpeed = parseFloat((panel.querySelector('input[name="Simulation Speed"]') as HTMLInputElement).value);
            const recyclingRegion = (panel.querySelector('input[name="Regional Recycling Rules"]:checked') as HTMLInputElement).value;
            applySimulationSettings({ simulationSpeed, recyclingRegion });
        });
    });
}