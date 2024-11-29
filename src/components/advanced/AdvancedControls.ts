import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';
import { applyLightingSettings, applyWasteSettings, applyApplianceSettings, applyRoleSettings, applySimulationSettings } from '../../models';

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
            const lightIntensity = parseFloat((panel.querySelector('input[name="Light Intensity"]') as HTMLInputElement).value);
            const lightingBrightness = parseFloat((panel.querySelector('input[name="Lighting Brightness"]') as HTMLInputElement).value);
            const colorTemperature = parseFloat((panel.querySelector('input[name="Color Temperature"]') as HTMLInputElement).value);
            applyLightingSettings({ lightingPreset: 'Advanced', lightIntensity, lightingBrightness, colorTemperature });

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