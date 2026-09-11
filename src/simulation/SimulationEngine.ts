import { processWaste } from './recycling';
import {
    KitchenSimulationConfig,
    SIMULATION_STAGES,
    SimulationEvent,
    SimulationMetrics,
    SimulationSnapshot,
    WasteCategory,
    createWasteBreakdown
} from './types';

export const DEFAULT_SIMULATION_CONFIG: KitchenSimulationConfig = {
    familySize: 4,
    groceryFrequencyDays: 3,
    mealPrepFrequencyPerWeek: 2,
    cookingFrequencyPerDay: 3,
    appliancesEnabled: ['Dishwasher', 'Microwave', 'Oven'],
    wasteFrequencyDays: 3,
    binCapacityLiters: 30,
    wasteCategories: ['Compost', 'Plastic', 'Glass', 'Paper', 'Metal', 'Hazardous'],
    applianceEfficiencyPercent: 100,
    ventilationSpeed: 2,
    ventilationEnabled: false,
    roles: ['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste'],
    roleWeightingCooking: 70,
    roleWeightingCleaning: 30,
    simulationSpeed: 1,
    recyclingRegion: 'USA',
    timeOfDay: 12
};

const WASTE_PROFILE: Readonly<Record<WasteCategory, number>> = {
    Compost: 0.46,
    Plastic: 0.18,
    Glass: 0.06,
    Paper: 0.12,
    Metal: 0.04,
    Hazardous: 0.01,
    General: 0.13
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 3): number {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
}

function cloneConfig(config: KitchenSimulationConfig): KitchenSimulationConfig {
    return {
        ...config,
        appliancesEnabled: [...config.appliancesEnabled],
        wasteCategories: [...config.wasteCategories],
        roles: [...config.roles]
    };
}

function createInitialMetrics(): SimulationMetrics {
    return {
        currentStage: SIMULATION_STAGES[0],
        elapsedHours: 0,
        cycleCount: 0,
        groceryInventoryKg: 0,
        groceryConsumedKg: 0,
        mealsPrepared: 0,
        mealsServed: 0,
        utensilUses: 0,
        dirtyDishes: 0,
        wasteGeneratedKg: 0,
        wasteByCategoryKg: createWasteBreakdown(),
        recycledKg: 0,
        compostedKg: 0,
        landfillKg: 0,
        recyclingAccuracyPercent: 0,
        binFillLiters: 0,
        wasteCollections: 0,
        energyKWh: 0,
        waterLiters: 0
    };
}

export class SimulationEngine {
    private config: KitchenSimulationConfig;
    private metrics: SimulationMetrics = createInitialMetrics();
    private stageIndex = 0;
    private recentEvents: SimulationEvent[] = [];
    private cycleFoodConsumedKg = 0;
    private correctlySortedKg = 0;
    private sortableWasteKg = 0;

    constructor(config: Partial<KitchenSimulationConfig> = {}) {
        this.config = cloneConfig(DEFAULT_SIMULATION_CONFIG);
        this.updateConfig(config);
    }

    updateConfig(updates: Partial<KitchenSimulationConfig>): SimulationSnapshot {
        const next: KitchenSimulationConfig = {
            ...this.config,
            ...updates,
            appliancesEnabled: updates.appliancesEnabled ? [...updates.appliancesEnabled] : [...this.config.appliancesEnabled],
            wasteCategories: updates.wasteCategories ? [...updates.wasteCategories] : [...this.config.wasteCategories],
            roles: updates.roles ? [...updates.roles] : [...this.config.roles]
        };

        next.familySize = Math.round(clamp(next.familySize, 1, 12));
        next.groceryFrequencyDays = Math.round(clamp(next.groceryFrequencyDays, 1, 21));
        next.mealPrepFrequencyPerWeek = Math.round(clamp(next.mealPrepFrequencyPerWeek, 1, 7));
        next.cookingFrequencyPerDay = Math.round(clamp(next.cookingFrequencyPerDay, 1, 10));
        next.wasteFrequencyDays = Math.round(clamp(next.wasteFrequencyDays, 1, 14));
        next.binCapacityLiters = clamp(next.binCapacityLiters, 10, 100);
        next.applianceEfficiencyPercent = clamp(next.applianceEfficiencyPercent, 10, 200);
        next.ventilationSpeed = clamp(next.ventilationSpeed, 0, 5);
        next.roleWeightingCooking = clamp(next.roleWeightingCooking, 0, 100);
        next.roleWeightingCleaning = clamp(next.roleWeightingCleaning, 0, 100);
        next.simulationSpeed = clamp(next.simulationSpeed, 0.5, 5);
        next.timeOfDay = ((next.timeOfDay % 24) + 24) % 24;

        this.config = next;
        return this.getSnapshot();
    }

    reset(): SimulationSnapshot {
        this.metrics = createInitialMetrics();
        this.stageIndex = 0;
        this.recentEvents = [];
        this.cycleFoodConsumedKg = 0;
        this.correctlySortedKg = 0;
        this.sortableWasteKg = 0;
        return this.getSnapshot();
    }

    step(): SimulationSnapshot {
        const stage = SIMULATION_STAGES[this.stageIndex];
        this.metrics.currentStage = stage;

        switch (stage) {
            case 'grocery-storage':
                this.handleGroceryStorage();
                break;
            case 'meal-preparation':
                this.handleMealPreparation();
                break;
            case 'meal-serving':
                this.handleMealServing();
                break;
            case 'cleaning':
                this.handleCleaning();
                break;
            case 'waste-disposal':
                this.handleWasteDisposal();
                break;
        }

        this.metrics.elapsedHours = round(this.metrics.elapsedHours + 1.25);
        this.stageIndex = (this.stageIndex + 1) % SIMULATION_STAGES.length;
        return this.getSnapshot();
    }

    runCycle(): SimulationSnapshot {
        for (let index = 0; index < SIMULATION_STAGES.length; index += 1) {
            this.step();
        }
        return this.getSnapshot();
    }

    getSnapshot(): SimulationSnapshot {
        return {
            config: cloneConfig(this.config),
            metrics: {
                ...this.metrics,
                wasteByCategoryKg: { ...this.metrics.wasteByCategoryKg }
            },
            recentEvents: this.recentEvents.map((event) => ({ ...event }))
        };
    }

    private handleGroceryStorage(): void {
        this.cycleFoodConsumedKg = 0;
        const targetInventory = this.config.familySize * 0.55 * this.config.groceryFrequencyDays;
        const restockKg = Math.max(0, targetInventory - this.metrics.groceryInventoryKg);
        this.metrics.groceryInventoryKg = round(this.metrics.groceryInventoryKg + restockKg);
        this.addEvent(`Stored ${round(restockKg, 2)} kg of groceries for ${this.config.familySize} household members.`);
    }

    private handleMealPreparation(): void {
        const prepFactor = 0.8 + (this.config.mealPrepFrequencyPerWeek / 7) * 0.4;
        const cookingFactor = Math.min(this.config.cookingFrequencyPerDay, 4) / 2;
        const requestedKg = this.config.familySize * 0.32 * prepFactor * cookingFactor;
        const consumedKg = Math.min(this.metrics.groceryInventoryKg, requestedKg);
        const portions = Math.max(1, Math.round(this.config.familySize * Math.min(1.5, cookingFactor)));

        this.metrics.groceryInventoryKg = round(this.metrics.groceryInventoryKg - consumedKg);
        this.metrics.groceryConsumedKg = round(this.metrics.groceryConsumedKg + consumedKg);
        this.cycleFoodConsumedKg = round(this.cycleFoodConsumedKg + consumedKg);
        this.metrics.mealsPrepared += portions;
        this.metrics.utensilUses += portions * 2;
        this.metrics.dirtyDishes += portions;

        const efficiencyFactor = 100 / this.config.applianceEfficiencyPercent;
        const applianceEnergy = this.config.appliancesEnabled.reduce((total, appliance) => {
            const energyByAppliance: Record<string, number> = {
                Oven: 0.85,
                Microwave: 0.16,
                Blender: 0.04,
                Toaster: 0.05,
                Dishwasher: 0
            };
            return total + (energyByAppliance[appliance] ?? 0.03);
        }, 0);
        const ventilationEnergy = this.config.ventilationEnabled ? this.config.ventilationSpeed * 0.035 : 0;
        this.metrics.energyKWh = round(this.metrics.energyKWh + (applianceEnergy + ventilationEnergy) * efficiencyFactor);
        this.addEvent(`Prepared ${portions} portions using ${round(consumedKg, 2)} kg of groceries.`);
    }

    private handleMealServing(): void {
        const servings = Math.min(this.metrics.mealsPrepared - this.metrics.mealsServed, this.config.familySize);
        const served = Math.max(0, servings);
        this.metrics.mealsServed += served;
        this.metrics.utensilUses += served;
        this.metrics.dirtyDishes += served;
        this.addEvent(`Served ${served} portions to the household.`);
    }

    private handleCleaning(): void {
        const dishes = this.metrics.dirtyDishes;
        if (dishes <= 0) {
            this.addEvent('Cleaning stage completed with no accumulated dishes.');
            return;
        }

        const dishwasherEnabled = this.config.appliancesEnabled.includes('Dishwasher');
        if (dishwasherEnabled) {
            const efficiencyFactor = 100 / this.config.applianceEfficiencyPercent;
            this.metrics.waterLiters = round(this.metrics.waterLiters + Math.max(6, dishes * 0.55));
            this.metrics.energyKWh = round(this.metrics.energyKWh + Math.max(0.45, dishes * 0.035) * efficiencyFactor);
        } else {
            this.metrics.waterLiters = round(this.metrics.waterLiters + dishes * 2.4);
        }

        this.metrics.dirtyDishes = 0;
        this.addEvent(`Cleaned ${dishes} dishes using ${dishwasherEnabled ? 'the dishwasher' : 'hand washing'}.`);
    }

    private handleWasteDisposal(): void {
        const generatedKg = Math.max(0.05, this.cycleFoodConsumedKg * 0.22 + this.config.familySize * 0.03);
        const waste = createWasteBreakdown();

        (Object.keys(WASTE_PROFILE) as WasteCategory[]).forEach((category) => {
            const amount = generatedKg * WASTE_PROFILE[category];
            waste[category] = amount;
            this.metrics.wasteByCategoryKg[category] = round(this.metrics.wasteByCategoryKg[category] + amount);
        });

        const result = processWaste(waste, this.config.recyclingRegion, this.config.wasteCategories);
        this.metrics.wasteGeneratedKg = round(this.metrics.wasteGeneratedKg + generatedKg);
        this.metrics.recycledKg = round(this.metrics.recycledKg + result.recycledKg);
        this.metrics.compostedKg = round(this.metrics.compostedKg + result.compostedKg);
        this.metrics.landfillKg = round(this.metrics.landfillKg + result.landfillKg);
        this.correctlySortedKg += result.correctlySortedKg;
        this.sortableWasteKg += result.sortableKg;
        this.metrics.recyclingAccuracyPercent = this.sortableWasteKg > 0
            ? round((this.correctlySortedKg / this.sortableWasteKg) * 100, 1)
            : 100;

        this.metrics.binFillLiters = round(this.metrics.binFillLiters + generatedKg * 2.2, 1);
        this.metrics.cycleCount += 1;
        const collectionDue = this.metrics.binFillLiters >= this.config.binCapacityLiters
            || this.metrics.cycleCount % this.config.wasteFrequencyDays === 0;
        if (collectionDue) {
            this.metrics.wasteCollections += 1;
            this.metrics.binFillLiters = 0;
        }

        this.addEvent(
            `Sorted ${round(generatedKg, 2)} kg of waste under ${this.config.recyclingRegion} rules `
            + `(${this.metrics.recyclingAccuracyPercent}% cumulative accuracy).`
        );
    }

    private addEvent(message: string): void {
        this.recentEvents.unshift({
            stage: this.metrics.currentStage,
            message,
            elapsedHours: this.metrics.elapsedHours
        });
        this.recentEvents = this.recentEvents.slice(0, 8);
    }
}
