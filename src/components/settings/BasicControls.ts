import {
    applyEnergySettings,
    applyMealSettings,
    applyRoomDimensions,
    isSimulationRunning,
    toggleSimulation
} from '../../models';
import {
    createCheckboxGroup,
    createCollapsibleSection,
    createSlider,
    createTitle,
    createToggleButton
} from '../../guiHelpers';

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
    appliancesEnabled: ['Dishwasher', 'Microwave', 'Oven']
};

class Store {
    private state: StoreState = { ...initialState, appliancesEnabled: [...initialState.appliancesEnabled] };

    getState(): StoreState {
        return { ...this.state, appliancesEnabled: [...this.state.appliancesEnabled] };
    }

    updateState(updates: Partial<StoreState>): void {
        this.state = {
            ...this.state,
            ...updates,
            appliancesEnabled: updates.appliancesEnabled
                ? [...updates.appliancesEnabled]
                : [...this.state.appliancesEnabled]
        };
    }
}

export const basicStore = new Store();

export function addBasicControls(panel: HTMLElement): void {
    panel.appendChild(createTitle('Basic Controls'));

    const simulateButton = createToggleButton('Start simulation', () => {
        toggleSimulation();
        simulateButton.textContent = isSimulationRunning() ? 'Pause simulation' : 'Start simulation';
    });
    panel.appendChild(simulateButton);

    const familySection = createCollapsibleSection('Household & meals', panel);
    const familySize = createSlider('Family Size', 1, 12, initialState.familySize, familySection, 'people');
    const groceryFrequency = createSlider('Grocery Trip Frequency', 1, 21, initialState.groceryFrequency, familySection, 'days');
    const mealPrepFrequency = createSlider('Meal Prep Frequency', 1, 7, initialState.mealPrepFrequency, familySection, 'times/week');
    const cookingFrequency = createSlider('Cooking Frequency', 1, 10, initialState.cookingFrequency, familySection, 'meals/day');

    const roomSection = createCollapsibleSection('Room dimensions', panel);
    const roomWidth = createSlider('Room Width', 4, 40, initialState.roomWidth, roomSection, 'm');
    const roomLength = createSlider('Room Length', 4, 40, initialState.roomLength, roomSection, 'm');
    const ceilingHeight = createSlider('Ceiling Height', 2.4, 6, initialState.ceilingHeight, roomSection, 'm');

    const applianceSection = createCollapsibleSection('Appliances', panel);
    const applianceInputs = createCheckboxGroup(
        ['Dishwasher', 'Microwave', 'Oven', 'Blender', 'Toaster'],
        'Appliances Enabled',
        applianceSection,
        initialState.appliancesEnabled
    );

    const sync = (): void => {
        const state: StoreState = {
            familySize: Number(familySize.value),
            groceryFrequency: Number(groceryFrequency.value),
            mealPrepFrequency: Number(mealPrepFrequency.value),
            cookingFrequency: Number(cookingFrequency.value),
            roomWidth: Number(roomWidth.value),
            roomLength: Number(roomLength.value),
            ceilingHeight: Number(ceilingHeight.value),
            appliancesEnabled: applianceInputs.filter((input) => input.checked).map((input) => input.value)
        };
        basicStore.updateState(state);
        applyRoomDimensions({ width: state.roomWidth, length: state.roomLength, height: state.ceilingHeight });
        applyMealSettings({
            familySize: state.familySize,
            groceryFrequency: state.groceryFrequency,
            mealPrepFrequency: state.mealPrepFrequency,
            cookingFrequency: state.cookingFrequency
        });
        applyEnergySettings({ appliancesEnabled: state.appliancesEnabled });
    };

    [familySize, groceryFrequency, mealPrepFrequency, cookingFrequency, roomWidth, roomLength, ceilingHeight]
        .forEach((input) => input.addEventListener('input', sync));
    applianceInputs.forEach((input) => input.addEventListener('change', sync));

    sync();
}
