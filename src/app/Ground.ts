import { Scene, MeshBuilder, StandardMaterial, Mesh } from '@babylonjs/core';
import { MarbleProceduralTexture, WoodProceduralTexture, GrassProceduralTexture } from '@babylonjs/procedural-textures';
import { getDimensions, getWallHeight, getWallThickness } from './roomStore';
import { updateDimensions, updateWallHeight, updateWallThickness } from './updateFunctions';

function createMarbleMaterial(scene: Scene): StandardMaterial {
    const marbleMaterial = new StandardMaterial("marbleMat", scene);
    const marbleTexture = new MarbleProceduralTexture("marbleTex", 1024, scene);
    marbleTexture.numberOfTilesHeight = 8;
    marbleTexture.numberOfTilesWidth = 8;
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

function createGrassMaterial(scene: Scene): StandardMaterial {
    const grassMaterial = new StandardMaterial("grassMat", scene);
    const grassTexture = new GrassProceduralTexture("grassTex", 2048, scene);
    grassMaterial.diffuseTexture = grassTexture;
    return grassMaterial;
}

let floor: Mesh, extendedGround: Mesh, walls: Mesh[], ceiling: Mesh;

export function createGround(scene: Scene): void {
    const { width: groundWidth, height: groundHeight } = getDimensions();
    const wallHeight = getWallHeight();
    const wallThickness = getWallThickness();

    floor = MeshBuilder.CreateBox("floor", { width: groundWidth, height: 0.1, depth: groundHeight }, scene);
    floor.position.y = 0.05;
    floor.material = createMarbleMaterial(scene); // Marble floor

    extendedGround = MeshBuilder.CreateGround("extendedGround", { width: 500, height: 500 }, scene);
    extendedGround.position.y = 0;
    extendedGround.material = createGrassMaterial(scene); // Grass ground

    const wallAndCeilingMaterial = createWoodMaterial(scene); // Wood material for walls and ceiling

    walls = [
        MeshBuilder.CreateBox("wall1", { width: groundWidth, height: wallHeight, depth: wallThickness }, scene),
        MeshBuilder.CreateBox("wall2", { width: groundWidth, height: wallHeight, depth: wallThickness }, scene),
        MeshBuilder.CreateBox("wall3", { width: wallThickness, height: wallHeight, depth: groundHeight }, scene),
        MeshBuilder.CreateBox("wall4", { width: wallThickness, height: wallHeight, depth: groundHeight }, scene)
    ];

    walls[0].position.set(0, wallHeight / 2, -groundHeight / 2);
    walls[1].position.set(0, wallHeight / 2, groundHeight / 2);
    walls[2].position.set(-groundWidth / 2, wallHeight / 2, 0);
    walls[3].position.set(groundWidth / 2, wallHeight / 2, 0);

    walls.forEach(wall => wall.material = wallAndCeilingMaterial);

    ceiling = MeshBuilder.CreateBox("ceiling", { width: groundWidth, height: wallThickness, depth: groundHeight }, scene);
    ceiling.position.y = wallHeight;
    ceiling.material = wallAndCeilingMaterial;
}

export { updateDimensions, updateWallHeight, updateWallThickness };