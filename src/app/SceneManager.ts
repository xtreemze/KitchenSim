import { Engine, Scene, ScenePerformancePriority } from '@babylonjs/core';
import { createLightManager } from './LightManager';
import { createCameraManager } from './CameraManager';
import { loadCabinets } from './AssetLoader';
import { createGround } from './Ground';

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

    // Load assets
    loadCabinets(scene);

    // Start rendering the scene
    engine.runRenderLoop(() => {
        scene.render();
    });

    return scene;
}
