import { Scene, MeshBuilder, Mesh } from '@babylonjs/core';
import { getDimensions, getWallHeight, getWallThickness, setDimensions, setWallHeight, setWallThickness } from './roomStore';
import { createMarbleMaterial, createWoodMaterial, createGrassMaterial } from './materials';

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

function updateDimensions(width: number, height: number) {
    setDimensions(width, height);
    floor.scaling.set(width / floor.scaling.x, 1, height / floor.scaling.z);
    walls[0].scaling.set(width / walls[0].scaling.x, getWallHeight() / walls[0].scaling.y, getWallThickness() / walls[0].scaling.z);
    walls[1].scaling.set(width / walls[1].scaling.x, getWallHeight() / walls[1].scaling.y, getWallThickness() / walls[1].scaling.z);
    walls[2].scaling.set(getWallThickness() / walls[2].scaling.x, getWallHeight() / walls[2].scaling.y, height / walls[2].scaling.z);
    walls[3].scaling.set(getWallThickness() / walls[3].scaling.x, getWallHeight() / walls[3].scaling.y, height / walls[3].scaling.z);

    walls[0].position.set(0, getWallHeight() / 2, -height / 2);
    walls[1].position.set(0, getWallHeight() / 2, height / 2);
    walls[2].position.set(-width / 2, getWallHeight() / 2, 0);
    walls[3].position.set(width / 2, getWallHeight() / 2, 0);

    ceiling.scaling.set(width / ceiling.scaling.x, getWallThickness() / ceiling.scaling.y, height / ceiling.scaling.z);
}

function updateWallHeight(height: number) {
    setWallHeight(height);
    walls.forEach(wall => wall.scaling.y = height / wall.scaling.y);
    ceiling.position.y = height;
    floor.position.y = height / 2;

    walls[0].position.set(0, height / 2, -getDimensions().height / 2);
    walls[1].position.set(0, height / 2, getDimensions().height / 2);
    walls[2].position.set(-getDimensions().width / 2, height / 2, 0);
    walls[3].position.set(getDimensions().width / 2, height / 2, 0);
}

function updateWallThickness(thickness: number) {
    setWallThickness(thickness);
    walls[0].scaling.z = thickness / walls[0].scaling.z;
    walls[1].scaling.z = thickness / walls[1].scaling.z;
    walls[2].scaling.x = thickness / walls[2].scaling.x;
    walls[3].scaling.x = thickness / walls[3].scaling.x;
    ceiling.scaling.y = thickness / ceiling.scaling.y;
    floor.scaling.y = thickness / floor.scaling.y;
}

export { updateDimensions, updateWallHeight, updateWallThickness };