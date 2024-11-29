import { Scene, MeshBuilder, StandardMaterial } from '@babylonjs/core';
import { MarbleProceduralTexture, WoodProceduralTexture } from '@babylonjs/procedural-textures';

function createMarbleMaterial(scene: Scene): StandardMaterial {
    const marbleMaterial = new StandardMaterial("marbleMat", scene);
    const marbleTexture = new MarbleProceduralTexture("marbleTex", 512, scene);
    marbleTexture.numberOfTilesHeight = 5;
    marbleTexture.numberOfTilesWidth = 5;
    marbleMaterial.ambientTexture = marbleTexture;
    return marbleMaterial;
}

function createWoodMaterial(scene: Scene): StandardMaterial {
    const woodMaterial = new StandardMaterial("woodMat", scene);
    const woodTexture = new WoodProceduralTexture("woodTex", 1024, scene);
    woodTexture.ampScale = 80.0;
    woodMaterial.diffuseTexture = woodTexture;
    woodMaterial.backFaceCulling = false; // Ensure the material is visible from inside
    woodMaterial.alpha = 0.5; // Make the outer side transparent
    return woodMaterial;
}

export function createGround(scene: Scene): void {
    const groundWidth = 20;
    const groundHeight = 10;
    const wallHeight = 3;
    const wallThickness = 0.1;

    const ground = MeshBuilder.CreateGround("ground", { width: groundWidth, height: groundHeight }, scene);
    ground.position.y = 0.01;
    ground.material = createMarbleMaterial(scene); // Marble floor

    const wallAndCeilingMaterial = createWoodMaterial(scene); // Wood material for walls and ceiling

    const walls = [
        { name: "wall1", dimensions: { width: groundWidth, height: wallHeight, depth: wallThickness }, position: { x: 0, y: wallHeight / 2, z: -groundHeight / 2 } },
        { name: "wall2", dimensions: { width: groundWidth, height: wallHeight, depth: wallThickness }, position: { x: 0, y: wallHeight / 2, z: groundHeight / 2 } },
        { name: "wall3", dimensions: { width: wallThickness, height: wallHeight, depth: groundHeight }, position: { x: -groundWidth / 2, y: wallHeight / 2, z: 0 } },
        { name: "wall4", dimensions: { width: wallThickness, height: wallHeight, depth: groundHeight }, position: { x: groundWidth / 2, y: wallHeight / 2, z: 0 } }
    ];

    walls.forEach(wall => {
        const wallMesh = MeshBuilder.CreateBox(wall.name, wall.dimensions, scene);
        wallMesh.position.set(wall.position.x, wall.position.y, wall.position.z);
        wallMesh.material = wallAndCeilingMaterial;
    });

    const ceiling = MeshBuilder.CreateBox("ceiling", { width: groundWidth, height: wallThickness, depth: groundHeight }, scene);
    ceiling.position.y = wallHeight;
    ceiling.material = wallAndCeilingMaterial;
}