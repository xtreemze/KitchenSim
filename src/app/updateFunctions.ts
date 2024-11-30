import { Mesh } from '@babylonjs/core';
import { setRoomState, getRoomState } from './roomStore';

let floor: Mesh, walls: Mesh[], ceiling: Mesh;

const DEFAULT_FLOOR_THICKNESS = 0.1;

/**
 * Updates the dimensions of the room and scales the meshes accordingly.
 *
 * @param width - The new width of the room in meters.
 * @param height - The new height of the room in meters.
 */
function updateDimensions(width: number, height: number) {
    setRoomState({ dimensions: { width, height } });
    const { wallHeight, wallThickness } = getRoomState();

    scaleMesh(floor, width, DEFAULT_FLOOR_THICKNESS, height);
    scaleMesh(ceiling, width, wallThickness, height);

    walls.forEach((wall, index) => {
        if (index < 2) {
            scaleMesh(wall, width, wallHeight, wallThickness);
            wall.position.set(0, wallHeight / 2, index === 0 ? -height / 2 : height / 2);
        } else {
            scaleMesh(wall, wallThickness, wallHeight, height);
            wall.position.set(index === 2 ? -width / 2 : width / 2, wallHeight / 2, 0);
        }
    });
}

/**
 * Updates the height of the walls and scales the meshes accordingly.
 *
 * @param height - The new height of the walls in meters.
 */
function updateWallHeight(height: number) {
    setRoomState({ wallHeight: height });
    const { wallThickness } = getRoomState();

    walls.forEach(wall => {
        scaleMesh(wall, wall.scaling.x, height, wall.scaling.z);
        wall.position.y = height / 2;
    });

    ceiling.position.y = height;
    scaleMesh(ceiling, ceiling.scaling.x, wallThickness, ceiling.scaling.z);
}

/**
 * Updates the thickness of the walls and scales the meshes accordingly.
 *
 * @param thickness - The new thickness of the walls in meters.
 */
function updateWallThickness(thickness: number) {
    setRoomState({ wallThickness: thickness });

    walls.forEach((wall, index) => {
        if (index < 2) {
            scaleMesh(wall, wall.scaling.x, wall.scaling.y, thickness);
        } else {
            scaleMesh(wall, thickness, wall.scaling.y, wall.scaling.z);
        }
    });

    scaleMesh(ceiling, ceiling.scaling.x, thickness, ceiling.scaling.z);
}

/**
 * Scales a mesh to the specified dimensions.
 *
 * @param mesh - The mesh to scale.
 * @param x - The new width of the mesh in meters.
 * @param y - The new height of the mesh in meters.
 * @param z - The new depth of the mesh in meters.
 */
function scaleMesh(mesh: Mesh, x: number, y: number, z: number) {
    mesh.scaling.set(x, y, z);
}

export { updateDimensions, updateWallHeight, updateWallThickness };