import { MeshBuilder, StandardMaterial, Color3, Scene } from '@babylonjs/core';

export function createCabinet(scene: Scene) {
    // Create the cabinet box
    const cabinet = MeshBuilder.CreateBox("cabinet", { width: 2, height: 3, depth: 1 }, scene);

    // Position the cabinet above the ground
    cabinet.position.y = 1.5; // Half the height of the cabinet to lift it above the ground

    // Add a material to the cabinet
    const material = new StandardMaterial("cabinetMaterial", scene);
    material.diffuseColor = new Color3(0.6, 0.3, 0); // Brown color
    cabinet.material = material;

    return cabinet;
}
