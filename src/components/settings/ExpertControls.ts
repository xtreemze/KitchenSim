import { applyRoleSettings, applySimulationSettings, setTimeOfDay } from '../../models';
import {
    createCheckboxGroup,
    createCollapsibleSection,
    createRadioGroup,
    createSlider,
    createTitle
} from '../../guiHelpers';
import { RecyclingRegion } from '../../simulation/types';

interface StoreState {
    timeOfDay: number;
    roles: string[];
    roleWeightingCooking: number;
    roleWeightingCleaning: number;
    simulationSpeed: number;
    recyclingRegion: RecyclingRegion;
}

const initialState: StoreState = {
    timeOfDay: 12,
    roles: ['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste'],
    roleWeightingCooking: 70,
    roleWeightingCleaning: 30,
    simulationSpeed: 1,
    recyclingRegion: 'USA'
};

class Store {
    private state: StoreState = { ...initialState, roles: [...initialState.roles] };

    getState(): StoreState {
        return { ...this.state, roles: [...this.state.roles] };
    }

    updateState(updates: Partial<StoreState>): void {
        this.state = {
            ...this.state,
            ...updates,
            roles: updates.roles ? [...updates.roles] : [...this.state.roles]
        };
    }
}

const expertStore = new Store();

export function addExpertControls(panel: HTMLElement): void {
    panel.appendChild(createTitle('Expert Controls'));

    const timeSection = createCollapsibleSection('Time of day', panel);
    const timeOfDay = createSlider('Time of Day', 0, 23, initialState.timeOfDay, timeSection, 'h');

    const roleSection = createCollapsibleSection('Household roles', panel);
    const roleInputs = createCheckboxGroup(
        ['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste', 'Setting Up'],
        'Assign Roles',
        roleSection,
        initialState.roles
    );
    const cookingWeight = createSlider('Role Weighting Cooking', 0, 100, initialState.roleWeightingCooking, roleSection, '%');
    const cleaningWeight = createSlider('Role Weighting Cleaning', 0, 100, initialState.roleWeightingCleaning, roleSection, '%');

    const simulationSection = createCollapsibleSection('Simulation', panel);
    const simulationSpeed = createSlider('Simulation Speed', 0.5, 5, initialState.simulationSpeed, simulationSection, 'x');
    simulationSpeed.step = '0.5';
    const recyclingInputs = createRadioGroup(['USA', 'Japan', 'EU'], 'Regional Recycling Rules', simulationSection, initialState.recyclingRegion);

    const sync = (): void => {
        const recyclingRegion = (recyclingInputs.find((input) => input.checked)?.value ?? 'USA') as RecyclingRegion;
        const state: StoreState = {
            timeOfDay: Number(timeOfDay.value),
            roles: roleInputs.filter((input) => input.checked).map((input) => input.value),
            roleWeightingCooking: Number(cookingWeight.value),
            roleWeightingCleaning: Number(cleaningWeight.value),
            simulationSpeed: Number(simulationSpeed.value),
            recyclingRegion
        };
        expertStore.updateState(state);
        setTimeOfDay(state.timeOfDay);
        applyRoleSettings({
            roles: state.roles,
            roleWeightingCooking: state.roleWeightingCooking,
            roleWeightingCleaning: state.roleWeightingCleaning
        });
        applySimulationSettings({
            simulationSpeed: state.simulationSpeed,
            recyclingRegion: state.recyclingRegion
        });
    };

    [timeOfDay, cookingWeight, cleaningWeight, simulationSpeed]
        .forEach((input) => input.addEventListener('input', sync));
    [...roleInputs, ...recyclingInputs].forEach((input) => input.addEventListener('change', sync));

    sync();
}

export function getStore(): Store {
    return expertStore;
}
