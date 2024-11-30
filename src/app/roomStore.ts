import { Mesh, Scene, MeshBuilder } from "@babylonjs/core";
import { createGrassMaterial, createMarbleMaterial, createWoodMaterial } from "./materials";

const DEFAULT_DIMENSIONS = { width: 20, height: 10 }; // in meters
const DEFAULT_WALL_HEIGHT = 4; // in meters
const DEFAULT_WALL_THICKNESS = 0.1; // in meters
const DEFAULT_FLOOR_THICKNESS = 0.1; // in meters

let roomState = {
    dimensions: DEFAULT_DIMENSIONS,
    wallHeight: DEFAULT_WALL_HEIGHT,
    wallThickness: DEFAULT_WALL_THICKNESS
};

let floor: Mesh, walls: Mesh[], ceiling: Mesh;

/**
 * Sets the room state with the provided updates.
 *
 * @param updates - Partial updates to the room state.
 */
export function setRoomState(updates: Partial<typeof roomState>) {
    roomState = { ...roomState, ...updates };
}

/**
 * Gets the current room state.
 *
 * @returns The current room state.
 */
export function getRoomState() {
    return { ...roomState };
}

/**
 * Creates the floor mesh for the room.
 *
 * @param scene - The Babylon.js scene.
 * @param width - The width of the floor in meters.
 * @param height - The height of the floor in meters.
 * @returns The created floor mesh.
 */
export function createFloor(scene: Scene, width: number, height: number): Mesh {
    floor = MeshBuilder.CreateBox("floor", { width, height: DEFAULT_FLOOR_THICKNESS, depth: height }, scene);
    floor.position.y = DEFAULT_FLOOR_THICKNESS / 2;
    floor.material = createMarbleMaterial(scene);
    return floor;
}

/**
 * Creates the extended ground mesh for the room.
 *
 * @param scene - The Babylon.js scene.
 * @returns The created extended ground mesh.
 */
export function createExtendedGround(scene: Scene): Mesh {
    const extendedGround = MeshBuilder.CreateGround("extendedGround", { width: 500, height: 500 }, scene);
    extendedGround.position.y = 0;
    extendedGround.material = createGrassMaterial(scene);
    return extendedGround;
}

/**
 * Creates the wall meshes for the room.
 *
 * @param scene - The Babylon.js scene.
 * @param width - The width of the walls in meters.
 * @param height - The height of the walls in meters.
 * @param thickness - The thickness of the walls in meters.
 * @returns An array of created wall meshes.
 */
export function createWalls(scene: Scene, width: number, height: number, thickness: number): Mesh[] {
    const wallAndCeilingMaterial = createWoodMaterial(scene);
    walls = [
        MeshBuilder.CreateBox("wall1", { width, height, depth: thickness }, scene),
        MeshBuilder.CreateBox("wall2", { width, height, depth: thickness }, scene),
        MeshBuilder.CreateBox("wall3", { width: thickness, height, depth: height }, scene),
        MeshBuilder.CreateBox("wall4", { width: thickness, height, depth: height }, scene)
    ];

    walls.forEach(wall => {
        wall.position.y = height / 2;
        wall.material = wallAndCeilingMaterial;
    });

    walls[0].position.z = -height / 2;
    walls[1].position.z = height / 2;
    walls[2].position.x = -width / 2;
    walls[3].position.x = width / 2;

    return walls;
}

/**
 * Creates the ceiling mesh for the room.
 *
 * @param scene - The Babylon.js scene.
 * @param width - The width of the ceiling in meters.
 * @param height - The height of the ceiling in meters.
 * @param thickness - The thickness of the ceiling in meters.
 * @returns The created ceiling mesh.
 */
export function createCeiling(scene: Scene, width: number, height: number, thickness: number): Mesh {
    ceiling = MeshBuilder.CreateBox("ceiling", { width, height: thickness, depth: height }, scene);
    ceiling.position.y = height;
    ceiling.material = createWoodMaterial(scene);
    return ceiling;
}

/**
 * Updates the dimensions of the room in the scene.
 *
 * @param scene - The Babylon.js scene.
 * @param dimensions - The new dimensions of the room in meters.
 */
export function updateSceneRoomDimensions(scene: Scene, dimensions: { width: number, length: number, height: number }) {
    updateGround(scene, dimensions);
    updateCeiling(scene, dimensions);
    updateWalls(scene, dimensions);
}

function updateGround(scene: Scene, dimensions: { width: number, length: number }) {
    const ground = scene.getMeshByName("ground") as Mesh;
    if (ground) {
        scaleMesh(ground, dimensions.width, ground.scaling.y, dimensions.length);
    }
}

function updateCeiling(scene: Scene, dimensions: { width: number, length: number, height: number }) {
    const ceiling = scene.getMeshByName("ceiling") as Mesh;
    if (ceiling) {
        scaleMesh(ceiling, dimensions.width, ceiling.scaling.y, dimensions.length);
        ceiling.position.y = dimensions.height;
    }
}

function updateWalls(scene: Scene, dimensions: { width: number, length: number, height: number }) {
    const wall1 = scene.getMeshByName("wall1") as Mesh;
    if (wall1) {
        scaleMesh(wall1, dimensions.width, dimensions.height, wall1.scaling.z);
        wall1.position.z = -dimensions.length / 2;
    }

    const wall2 = scene.getMeshByName("wall2") as Mesh;
    if (wall2) {
        scaleMesh(wall2, dimensions.width, dimensions.height, wall2.scaling.z);
        wall2.position.z = dimensions.length / 2;
    }

    const wall3 = scene.getMeshByName("wall3") as Mesh;
    if (wall3) {
        scaleMesh(wall3, wall3.scaling.x, dimensions.height, dimensions.length);
        wall3.position.x = -dimensions.width / 2;
    }

    const wall4 = scene.getMeshByName("wall4") as Mesh;
    if (wall4) {
        scaleMesh(wall4, wall4.scaling.x, dimensions.height, dimensions.length);
        wall4.position.x = dimensions.width / 2;
    }
}

function scaleMesh(mesh: Mesh, x: number, y: number, z: number) {
    mesh.scaling.set(x, y, z);
}