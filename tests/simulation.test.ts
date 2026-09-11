import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { SimulationEngine } from '../src/simulation/SimulationEngine';
import { SIMULATION_STAGES } from '../src/simulation/types';

test('simulation advances through every advertised kitchen stage', () => {
    const engine = new SimulationEngine();
    const stages = SIMULATION_STAGES.map(() => engine.step().metrics.currentStage);
    assert.deepEqual(stages, [...SIMULATION_STAGES]);
    assert.equal(engine.getSnapshot().metrics.cycleCount, 1);
});

test('a complete cycle produces measurable household activity', () => {
    const engine = new SimulationEngine({
        familySize: 4,
        appliancesEnabled: ['Dishwasher', 'Microwave', 'Oven']
    });
    const snapshot = engine.runCycle();

    assert.ok(snapshot.metrics.groceryConsumedKg > 0);
    assert.ok(snapshot.metrics.mealsPrepared > 0);
    assert.ok(snapshot.metrics.mealsServed > 0);
    assert.ok(snapshot.metrics.utensilUses > 0);
    assert.ok(snapshot.metrics.wasteGeneratedKg > 0);
    assert.ok(snapshot.metrics.energyKWh > 0);
    assert.ok(snapshot.metrics.waterLiters > 0);
});

test('household size materially changes simulation demand', () => {
    const smallHousehold = new SimulationEngine({ familySize: 2 }).runCycle();
    const largeHousehold = new SimulationEngine({ familySize: 8 }).runCycle();

    assert.ok(largeHousehold.metrics.groceryConsumedKg > smallHousehold.metrics.groceryConsumedKg);
    assert.ok(largeHousehold.metrics.mealsPrepared > smallHousehold.metrics.mealsPrepared);
    assert.ok(largeHousehold.metrics.wasteGeneratedKg > smallHousehold.metrics.wasteGeneratedKg);
});

test('regional recycling rules produce different sorting outcomes', () => {
    const usa = new SimulationEngine({ recyclingRegion: 'USA' }).runCycle();
    const japan = new SimulationEngine({ recyclingRegion: 'Japan' }).runCycle();
    const eu = new SimulationEngine({ recyclingRegion: 'EU' }).runCycle();

    assert.notEqual(usa.metrics.recyclingAccuracyPercent, japan.metrics.recyclingAccuracyPercent);
    assert.notEqual(usa.metrics.compostedKg, eu.metrics.compostedKg);
    assert.ok(japan.metrics.recycledKg > usa.metrics.recycledKg);
});

test('disabling recyclable waste streams lowers sorting accuracy', () => {
    const fullySorted = new SimulationEngine({
        recyclingRegion: 'EU',
        wasteCategories: ['Compost', 'Plastic', 'Glass', 'Paper', 'Metal', 'Hazardous']
    }).runCycle();
    const compostOnly = new SimulationEngine({
        recyclingRegion: 'EU',
        wasteCategories: ['Compost']
    }).runCycle();

    assert.ok(fullySorted.metrics.recyclingAccuracyPercent > compostOnly.metrics.recyclingAccuracyPercent);
    assert.ok(fullySorted.metrics.recycledKg > compostOnly.metrics.recycledKg);
});
