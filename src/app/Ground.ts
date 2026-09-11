import { Scene } from '@babylonjs/core';
import {
    createCeiling,
    createExtendedGround,
    createFloor,
    createWalls,
    getRoomState
} from './roomStore';

export function createGround(scene: Scene): void {
    const {
        dimensions: { width, height: length },
        wallHeight,
        wallThickness
    } = getRoomState();

    createFloor(scene, width, length);
    createExtendedGround(scene);
    createWalls(scene, width, length, wallHeight, wallThickness);
    createCeiling(scene, width, length, wallHeight, wallThickness);
}
