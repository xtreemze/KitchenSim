import { Scene, ArcRotateCamera, Vector3 } from '@babylonjs/core';

export function createCameraManager(scene: Scene, canvas: HTMLCanvasElement) {
    const initialize = () => {
        const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, new Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
    };

    initialize();
}
