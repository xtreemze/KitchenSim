import { Scene, HemisphericLight, Vector3 } from '@babylonjs/core';

export function createLightManager(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0.04, 1, 0.2), scene);

    const setLightIntensity = (intensity: number) => {
        light.intensity = intensity;
    };

    const setLightDirection = (direction: Vector3) => {
        light.direction = direction;
    };

    return {
        setLightIntensity,
        setLightDirection,
    };
}
