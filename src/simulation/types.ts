export const SIMULATION_STAGES = [
    'grocery-storage',
    'meal-preparation',
    'meal-serving',
    'cleaning',
    'waste-disposal'
] as const;

export type SimulationStage = typeof SIMULATION_STAGES[number];

export const WASTE_CATEGORIES = [
    'Compost',
    'Plastic',
    'Glass',
    'Paper',
    'Metal',
    'Hazardous',
    'General'
] as const;

export type WasteCategory = typeof WASTE_CATEGORIES[number];
export type RecyclingRegion = 'USA' | 'Japan' | 'EU';

export interface KitchenSimulationConfig {
    familySize: number;
    groceryFrequencyDays: number;
    mealPrepFrequencyPerWeek: number;
    cookingFrequencyPerDay: number;
    appliancesEnabled: string[];
    wasteFrequencyDays: number;
    binCapacityLiters: number;
    wasteCategories: WasteCategory[];
    applianceEfficiencyPercent: number;
    ventilationSpeed: number;
    ventilationEnabled: boolean;
    roles: string[];
    roleWeightingCooking: number;
    roleWeightingCleaning: number;
    simulationSpeed: number;
    recyclingRegion: RecyclingRegion;
    timeOfDay: number;
}

export interface SimulationMetrics {
    currentStage: SimulationStage;
    elapsedHours: number;
    cycleCount: number;
    groceryInventoryKg: number;
    groceryConsumedKg: number;
    mealsPrepared: number;
    mealsServed: number;
    utensilUses: number;
    dirtyDishes: number;
    wasteGeneratedKg: number;
    wasteByCategoryKg: Record<WasteCategory, number>;
    recycledKg: number;
    compostedKg: number;
    landfillKg: number;
    recyclingAccuracyPercent: number;
    binFillLiters: number;
    wasteCollections: number;
    energyKWh: number;
    waterLiters: number;
}

export interface SimulationEvent {
    stage: SimulationStage;
    message: string;
    elapsedHours: number;
}

export interface SimulationSnapshot {
    config: KitchenSimulationConfig;
    metrics: SimulationMetrics;
    recentEvents: SimulationEvent[];
}

export function createWasteBreakdown(): Record<WasteCategory, number> {
    return {
        Compost: 0,
        Plastic: 0,
        Glass: 0,
        Paper: 0,
        Metal: 0,
        Hazardous: 0,
        General: 0
    };
}
