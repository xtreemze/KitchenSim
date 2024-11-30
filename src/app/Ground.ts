import { Mesh, Scene } from '@babylonjs/core';
import { setRoomState, createFloor, createExtendedGround, createWalls, createCeiling, getRoomState } from './roomStore';
import { updateDimensions, updateWallHeight, updateWallThickness } from './updateFunctions';
import { basicStore } from '../components/settings/BasicControls';

let floor: Mesh, walls: Mesh[], ceiling: Mesh, extendedGround: Mesh;

const DEFAULT_WIDTH = 20; // Default width value in meters
const DEFAULT_HEIGHT = 20; // Default height value in meters

/**
 * Creates the ground and initializes the room dimensions.
 *
 * @param scene - The Babylon.js scene.
 */
export function createGround(scene: Scene): void {
    const { roomWidth, roomLength, ceilingHeight } = basicStore.getState();

    setRoomState({ dimensions: { width: roomWidth || DEFAULT_WIDTH, height: roomLength || DEFAULT_HEIGHT }, wallHeight: ceilingHeight });

    const { dimensions: { width: groundWidth, height: groundHeight }, wallHeight, wallThickness } = getRoomState();

    floor = createFloor(scene, groundWidth, groundHeight);
    extendedGround = createExtendedGround(scene);
    walls = createWalls(scene, groundWidth, wallHeight, wallThickness);
    ceiling = createCeiling(scene, groundWidth, wallHeight, wallThickness);
}

export { updateDimensions, updateWallHeight, updateWallThickness };