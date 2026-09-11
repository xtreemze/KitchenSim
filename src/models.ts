import { Color3, HemisphericLight, Scene } from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials';
import { syncAppliances, syncKitchenLayout, syncWasteStations } from './app/AssetLoader';
import { setRoomState, updateSceneRoomDimensions } from './app/roomStore';
import { KitchenHumans } from './components/avatars/KitchenHumans';
import { createSimulationDashboard, SimulationDashboard } from './simulation/Dashboard';
import { simulationRuntime } from './simulation/SimulationRuntime';
import { RecyclingRegion, SimulationSnapshot, WasteCategory } from './simulation/types';

interface RoomDimensions {
    width: number;
    length: number;
    height: number;
}

interface LightingState {
    lightIntensity: number;
    lightingBrightness: number;
    colorTemperature: number;
}

let sceneRef: Scene | null = null;
let household: KitchenHumans | null = null;
let dashboard: SimulationDashboard | null = null;
let unsubscribeRuntime: (() => void) | null = null;
let roomDimensions: RoomDimensions = { width: 10, length: 10, height: 3 };
let lightingState: LightingState = { lightIntensity: 1, lightingBrightness: 75, colorTemperature: 4000 };
let metricsVisible = true;

export function bindScene(scene: Scene): void {
    sceneRef = scene;
    household = new KitchenHumans(scene);
    dashboard = createSimulationDashboard();
    dashboard.setVisible(metricsVisible);
    household.setSelectionHandler((label, action) => dashboard?.setAvatarSelection(label, action));

    unsubscribeRuntime?.();
    unsubscribeRuntime = simulationRuntime.subscribe((snapshot, running) => {
        renderSnapshot(snapshot, running);
    });

    const snapshot = simulationRuntime.getSnapshot();
    syncKitchenLayout(scene, roomDimensions);
    syncAppliances(scene, snapshot.config.appliancesEnabled, roomDimensions);
    syncWasteStations(scene, snapshot.config.wasteCategories, snapshot.config.recyclingRegion, roomDimensions);
}

export function applyRoomDimensions(dimensions: RoomDimensions): void {
    roomDimensions = { ...dimensions };
    setRoomState({
        dimensions: { width: dimensions.width, height: dimensions.length },
        wallHeight: dimensions.height
    });
    if (!sceneRef) {
        return;
    }
    updateSceneRoomDimensions(sceneRef, dimensions);
    syncKitchenLayout(sceneRef, roomDimensions);
    const snapshot = simulationRuntime.getSnapshot();
    syncAppliances(sceneRef, snapshot.config.appliancesEnabled, roomDimensions);
    syncWasteStations(sceneRef, snapshot.config.wasteCategories, snapshot.config.recyclingRegion, roomDimensions);
}

export function applyMealSettings(settings: {
    familySize: number;
    groceryFrequency: number;
    mealPrepFrequency: number;
    cookingFrequency: number;
}): void {
    const snapshot = simulationRuntime.updateConfig({
        familySize: settings.familySize,
        groceryFrequencyDays: settings.groceryFrequency,
        mealPrepFrequencyPerWeek: settings.mealPrepFrequency,
        cookingFrequencyPerDay: settings.cookingFrequency
    });
    household?.syncHousehold(snapshot.config.familySize);
}

export function applyEnergySettings(settings: { appliancesEnabled: string[] }): void {
    const snapshot = simulationRuntime.updateConfig({ appliancesEnabled: settings.appliancesEnabled });
    if (sceneRef) {
        syncAppliances(sceneRef, snapshot.config.appliancesEnabled, roomDimensions);
    }
}

export function applyLightingSettings(settings: {
    lightingPreset: string;
    lightIntensity: number;
    lightingBrightness: number;
    colorTemperature: number;
}): void {
    lightingState = {
        lightIntensity: settings.lightIntensity,
        lightingBrightness: settings.lightingBrightness,
        colorTemperature: settings.colorTemperature
    };
    applyLightingForTime(getSimulatedTime(simulationRuntime.getSnapshot()));
}

export function applyWasteSettings(settings: {
    wasteFrequency: number;
    binCapacity: number;
    wasteCategories: WasteCategory[];
}): void {
    const snapshot = simulationRuntime.updateConfig({
        wasteFrequencyDays: settings.wasteFrequency,
        binCapacityLiters: settings.binCapacity,
        wasteCategories: settings.wasteCategories
    });
    if (sceneRef) {
        syncWasteStations(sceneRef, snapshot.config.wasteCategories, snapshot.config.recyclingRegion, roomDimensions);
    }
}

export function applyApplianceSettings(settings: {
    applianceEfficiency: number;
    ventilationSpeed: number;
    ventilationControls: string;
}): void {
    simulationRuntime.updateConfig({
        applianceEfficiencyPercent: settings.applianceEfficiency,
        ventilationSpeed: settings.ventilationSpeed,
        ventilationEnabled: settings.ventilationControls === 'On'
    });
}

export function applyRoleSettings(settings: {
    roles: string[];
    roleWeightingCooking: number;
    roleWeightingCleaning: number;
}): void {
    const snapshot = simulationRuntime.updateConfig({
        roles: settings.roles,
        roleWeightingCooking: settings.roleWeightingCooking,
        roleWeightingCleaning: settings.roleWeightingCleaning
    });
    household?.assignRoles(snapshot.config.roles);
}

export function applySimulationSettings(settings: {
    simulationSpeed: number;
    recyclingRegion: RecyclingRegion;
}): void {
    const snapshot = simulationRuntime.updateConfig({
        simulationSpeed: settings.simulationSpeed,
        recyclingRegion: settings.recyclingRegion
    });
    if (sceneRef) {
        syncWasteStations(sceneRef, snapshot.config.wasteCategories, snapshot.config.recyclingRegion, roomDimensions);
    }
}

export function setTimeOfDay(timeOfDay: number): void {
    const snapshot = simulationRuntime.updateConfig({ timeOfDay });
    applyLightingForTime(getSimulatedTime(snapshot));
}

export function getTimeOfDay(scene?: Scene): number {
    if (scene && !sceneRef) {
        sceneRef = scene;
    }
    const snapshot = simulationRuntime.getSnapshot();
    applyLightingForTime(getSimulatedTime(snapshot));
    return snapshot.config.timeOfDay;
}

export function applyCabinetAnimationSettings(settings: { openDoorDrawerAnimation: boolean }): void {
    if (!sceneRef) {
        return;
    }
    sceneRef.meshes.forEach((mesh) => {
        mesh.animations.forEach((animation) => {
            animation.enableBlending = settings.openDoorDrawerAnimation;
            animation.blendingSpeed = settings.openDoorDrawerAnimation ? 0.05 : 0;
        });
    });
}

export function toggleSimulation(): void {
    simulationRuntime.toggle();
}

export function isSimulationRunning(): boolean {
    return simulationRuntime.isRunning();
}

export function setMetricsVisibility(visible: boolean): void {
    metricsVisible = visible;
    dashboard?.setVisible(visible);
}

function renderSnapshot(snapshot: SimulationSnapshot, running: boolean): void {
    household?.syncHousehold(snapshot.config.familySize);
    household?.assignRoles(snapshot.config.roles);
    household?.performStage(snapshot.metrics.currentStage, roomDimensions);
    dashboard?.update(snapshot, running);
    applyLightingForTime(getSimulatedTime(snapshot));
}

function getSimulatedTime(snapshot: SimulationSnapshot): number {
    return (snapshot.config.timeOfDay + snapshot.metrics.elapsedHours) % 24;
}

function applyLightingForTime(timeOfDay: number): void {
    if (!sceneRef) {
        return;
    }

    const daylight = Math.max(0, Math.sin(((timeOfDay - 6) / 24) * Math.PI * 2));
    const dayFactor = 0.15 + daylight * 0.85;
    const light = sceneRef.getLightByName('light') as HemisphericLight | null;
    if (light) {
        light.intensity = lightingState.lightIntensity * (lightingState.lightingBrightness / 100) * dayFactor;
        const temperatureMix = Math.min(1, Math.max(0, (lightingState.colorTemperature - 2000) / 6000));
        light.diffuse = Color3.Lerp(
            new Color3(1, 0.68, 0.42),
            new Color3(0.72, 0.84, 1),
            temperatureMix
        );
    }

    const skyMaterial = sceneRef.getMaterialByName('skyMaterial') as SkyMaterial | null;
    if (skyMaterial) {
        skyMaterial.inclination = (timeOfDay - 12) / 24;
        skyMaterial.luminance = 0.08 + daylight * 1.1;
    }
}
