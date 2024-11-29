import { createSlider, createCheckboxGroup, createRadioGroup, createTitle, createCollapsibleSection } from '../../guiHelpers';

export function addAdvancedControls(panel: HTMLElement) {
    const title = createTitle('Advanced Controls');
    panel.appendChild(title);

    const roomSection = createCollapsibleSection('Room Dimensions', panel);
    createSlider('Room Width:', 2, 20, 10, 'Room Width', roomSection, 'meters');
    createSlider('Room Length:', 2, 20, 10, 'Room Length', roomSection, 'meters');
    createSlider('Ceiling Height:', 2, 5, 3, 'Ceiling Height', roomSection, 'meters');
    panel.appendChild(roomSection);

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
}