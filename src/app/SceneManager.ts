import { Engine, MeshBuilder, Scene, ScenePerformancePriority } from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials';
import { createLightManager } from './LightManager';
import { createCameraManager } from './CameraManager';
import { loadCabinets } from './AssetLoader';
import { createGround } from './Ground';
import { getTimeOfDay } from '../models';

export function initializeScene(canvasId: string): Scene {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Set performance priority
    scene.performancePriority = ScenePerformancePriority.BackwardCompatible;

    // Initialize light manager
    createLightManager(scene);

    // Initialize camera
    createCameraManager(scene, canvas);

    // Initialize ground, walls, and ceiling
    createGround(scene);

    // Add skybox
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;

    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    skybox.material = skyMaterial;

    // Load assets
    loadCabinets(scene);

    // Start rendering the scene
    engine.runRenderLoop(() => {
        scene.render();
    });

    getTimeOfDay(scene);

    return scene;
}
