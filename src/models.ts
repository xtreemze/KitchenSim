import { SkyMaterial } from '@babylonjs/materials';
import { getStore as getExpertStore } from './components/settings/ExpertControls';
import { setRoomState, updateSceneRoomDimensions } from './app/roomStore';

export function applyRoomDimensions(dimensions: { width: number, length: number, height: number }) {
    setRoomState({ dimensions: { width: dimensions.width, height: dimensions.length }, wallHeight: dimensions.height });
    generateKitchenLayout();
    updateSceneRoomDimensions(scene, dimensions);
}

import { scene } from './main'; // Adjust the import according to your project structure
import { Scene } from '@babylonjs/core';

function generateKitchenLayout() {
    // Logic to generate kitchen layout
}

export function applyMealSettings(settings: { familySize: number, groceryFrequency: number, mealPrepFrequency: number, cookingFrequency: number }) {
    generateCookware();
    assignAppliancesToCookingBehavior();
    // Logic to apply meal settings to the scene
}

function generateCookware() {
    // Logic to generate cookware
}

function assignAppliancesToCookingBehavior() {
    // Logic to assign appliances to cooking behavior
}

export function applyEnergySettings(settings: { appliancesEnabled: string[] }) {
    generateAppliances(settings.appliancesEnabled);
    trackEnergyUsage();
    // Logic to apply energy settings to the scene
}

function generateAppliances(appliancesEnabled: string[]) {
    // Logic to generate appliances
}

function trackEnergyUsage() {
    // Logic to track energy usage
}

export function applyLightingSettings(settings: { lightingPreset: string, lightIntensity: number, lightingBrightness: number, colorTemperature: number }) {
    applyLightingPreset();
    simulateDayNightCycle();
    // Logic to apply lighting settings to the scene
}

function applyLightingPreset() {
    // Logic to apply lighting preset
}

function simulateDayNightCycle() {
    // Logic to simulate day-night cycle
}

export function applyWasteSettings(settings: { wasteFrequency: number, binCapacity: number, wasteCategories: string[] }) {
    generateWasteBins();
    trackWasteLevels();
    // Logic to apply waste settings to the scene
}

function generateWasteBins() {
    // Logic to generate waste bins
}

function trackWasteLevels() {
    // Logic to track waste levels
}

export function applyApplianceSettings(settings: { applianceEfficiency: number, ventilationSpeed: number, ventilationControls: string }) {
    // Logic to apply appliance settings to the scene
}

export function applyRoleSettings(settings: { roles: string[], roleWeightingCooking: number, roleWeightingCleaning: number }) {
    assignAvatarRoles();
    // Logic to apply role settings to the scene
}

function assignAvatarRoles() {
    // Logic to assign avatar roles
}

export function applySimulationSettings(settings: { simulationSpeed: number, recyclingRegion: string }) {
    applySimulationTiming();
    // Logic to apply simulation settings to the scene
}

function applySimulationTiming() {
    // Logic to apply simulation timing
}

let sceneRef: Scene;

export function getTimeOfDay(scene?: Scene): number {
    if (scene) {
        sceneRef = scene;
    }
    const expertStore = getExpertStore();
    const timeOfDay = expertStore.getState().timeOfDay;
    const skyMaterial = sceneRef.getMaterialByName("skyMaterial") as SkyMaterial;
    if (skyMaterial) {
        const sunrise = 6; // 6 AM
        const sunset = 18; // 6 PM
        const dayDuration = sunset - sunrise;
        const nightDuration = 24 - dayDuration;

        if (timeOfDay >= sunrise && timeOfDay <= sunset) {
            skyMaterial.inclination = (timeOfDay - 12) / dayDuration; // Daytime
            skyMaterial.luminance = Math.max(0, 1.189 - (timeOfDay - sunrise) / dayDuration * 1.189); // Gradually decrease luminosity
        } else {
            if (timeOfDay > sunset) {
                skyMaterial.inclination = 0.5; // Nighttime after sunset
                skyMaterial.luminance = Math.min(1.189, (timeOfDay - sunset) / nightDuration * 1.189); // Gradually increase luminosity
            } else {
                skyMaterial.inclination = -0.5; // Nighttime before sunrise
                skyMaterial.luminance = Math.min(1.189, (sunrise - timeOfDay) / nightDuration * 1.189); // Gradually increase luminosity
            }
        }
    }
    return timeOfDay;
}

export function applyCabinetAnimationSettings(settings: { openDoorDrawerAnimation: boolean }) {
    const cabinetMeshes = scene.getMeshesByTags("cabinet");
    cabinetMeshes.forEach(mesh => {
        if (settings.openDoorDrawerAnimation) {
            mesh.animations.forEach(animation => {
                animation.enableBlending = true;
                animation.blendingSpeed = 0.05;
            });
        } else {
            mesh.animations.forEach(animation => {
                animation.enableBlending = false;
            });
        }
    });
}