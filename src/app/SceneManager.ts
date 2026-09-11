import { Engine, MeshBuilder, Scene, ScenePerformancePriority } from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials';
import { createCameraManager } from './CameraManager';
import { createGround } from './Ground';
import { createLightManager } from './LightManager';
import { loadCabinets } from './AssetLoader';

export function initializeScene(canvasId: string): Scene {
    const canvas = document.getElementById(canvasId);
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`Canvas #${canvasId} was not found.`);
    }

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.performancePriority = ScenePerformancePriority.BackwardCompatible;

    createLightManager(scene);
    createCameraManager(scene, canvas);
    createGround(scene);

    const skyMaterial = new SkyMaterial('skyMaterial', scene);
    skyMaterial.backFaceCulling = false;
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000 }, scene);
    skybox.material = skyMaterial;

    loadCabinets(scene);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
    return scene;
}
