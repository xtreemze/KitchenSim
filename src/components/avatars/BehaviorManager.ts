import { Vector3 } from '@babylonjs/core';
import { KitchenHumans } from './KitchenHumans';

export class BehaviorManager {
    constructor(private readonly kitchenHumans: KitchenHumans) {}

    handleGroceryStorage(dimensions: { width: number; length: number }): void {
        this.kitchenHumans.performStage('grocery-storage', dimensions);
    }

    handleCooking(dimensions: { width: number; length: number }): void {
        this.kitchenHumans.performStage('meal-preparation', dimensions);
    }

    handleMealServing(dimensions: { width: number; length: number }): void {
        this.kitchenHumans.performStage('meal-serving', dimensions);
    }

    handleCleaning(dimensions: { width: number; length: number }): void {
        this.kitchenHumans.performStage('cleaning', dimensions);
    }

    handleWasteDisposal(dimensions: { width: number; length: number }): void {
        this.kitchenHumans.performStage('waste-disposal', dimensions);
    }

    getDefaultInteractionOffset(): Vector3 {
        return new Vector3(0.55, 0, 0.55);
    }
}
