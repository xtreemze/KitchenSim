import { Mesh, MeshBuilder, Scene } from '@babylonjs/core';
import { createGrassMaterial, createMarbleMaterial, createWoodMaterial } from './materials';

const DEFAULT_DIMENSIONS = { width: 10, height: 10 };
const DEFAULT_WALL_HEIGHT = 3;
const DEFAULT_WALL_THICKNESS = 0.1;
const DEFAULT_FLOOR_THICKNESS = 0.1;

let roomState = {
    dimensions: DEFAULT_DIMENSIONS,
    wallHeight: DEFAULT_WALL_HEIGHT,
    wallThickness: DEFAULT_WALL_THICKNESS
};

let floor: Mesh | null = null;
let walls: Mesh[] = [];
let ceiling: Mesh | null = null;

export function setRoomState(updates: Partial<typeof roomState>): void {
    roomState = { ...roomState, ...updates };
}

export function getRoomState(): typeof roomState {
    return {
        ...roomState,
        dimensions: { ...roomState.dimensions }
    };
}

export function createFloor(scene: Scene, width: number, length: number): Mesh {
    floor = MeshBuilder.CreateBox('floor', {
        width,
        height: DEFAULT_FLOOR_THICKNESS,
        depth: length
    }, scene);
    floor.position.y = DEFAULT_FLOOR_THICKNESS / 2;
    floor.material = createMarbleMaterial(scene);
    return floor;
}

export function createExtendedGround(scene: Scene): Mesh {
    const extendedGround = MeshBuilder.CreateGround('extendedGround', { width: 500, height: 500 }, scene);
    extendedGround.position.y = 0;
    extendedGround.material = createGrassMaterial(scene);
    return extendedGround;
}

export function createWalls(
    scene: Scene,
    width: number,
    length: number,
    wallHeight: number,
    thickness: number
): Mesh[] {
    const material = createWoodMaterial(scene);
    walls = [
        MeshBuilder.CreateBox('wall1', { width, height: wallHeight, depth: thickness }, scene),
        MeshBuilder.CreateBox('wall2', { width, height: wallHeight, depth: thickness }, scene),
        MeshBuilder.CreateBox('wall3', { width: thickness, height: wallHeight, depth: length }, scene),
        MeshBuilder.CreateBox('wall4', { width: thickness, height: wallHeight, depth: length }, scene)
    ];

    walls.forEach((wall) => {
        wall.position.y = wallHeight / 2;
        wall.material = material;
    });
    walls[0].position.z = -length / 2;
    walls[1].position.z = length / 2;
    walls[2].position.x = -width / 2;
    walls[3].position.x = width / 2;
    return walls;
}

export function createCeiling(
    scene: Scene,
    width: number,
    length: number,
    wallHeight: number,
    thickness: number
): Mesh {
    ceiling = MeshBuilder.CreateBox('ceiling', { width, height: thickness, depth: length }, scene);
    ceiling.position.y = wallHeight;
    ceiling.material = createWoodMaterial(scene);
    return ceiling;
}

export function updateSceneRoomDimensions(
    scene: Scene,
    dimensions: { width: number; length: number; height: number }
): void {
    setRoomState({
        dimensions: { width: dimensions.width, height: dimensions.length },
        wallHeight: dimensions.height
    });

    floor?.dispose();
    walls.forEach((wall) => wall.dispose());
    ceiling?.dispose();

    floor = createFloor(scene, dimensions.width, dimensions.length);
    walls = createWalls(scene, dimensions.width, dimensions.length, dimensions.height, roomState.wallThickness);
    ceiling = createCeiling(scene, dimensions.width, dimensions.length, dimensions.height, roomState.wallThickness);
}
