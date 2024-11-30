import { Mesh } from '@babylonjs/core';
import { setDimensions, setWallHeight, setWallThickness, getWallHeight, getWallThickness } from './roomStore';

let floor: Mesh, walls: Mesh[], ceiling: Mesh;

function updateDimensions(width: number, height: number) {
    setDimensions(width, height);
    floor.scaling.set(width / floor.scaling.x, 1, height / floor.scaling.z);
    walls[0].scaling.set(width / walls[0].scaling.x, getWallHeight() / walls[0].scaling.y, getWallThickness() / walls[0].scaling.z);
    walls[1].scaling.set(width / walls[1].scaling.x, getWallHeight() / walls[1].scaling.y, getWallThickness() / walls[1].scaling.z);
    walls[2].scaling.set(getWallThickness() / walls[2].scaling.x, getWallHeight() / walls[2].scaling.y, height / walls[2].scaling.z);
    walls[3].scaling.set(getWallThickness() / walls[3].scaling.x, getWallHeight() / walls[3].scaling.y, height / walls[3].scaling.z);
    ceiling.scaling.set(width / ceiling.scaling.x, getWallThickness() / ceiling.scaling.y, height / ceiling.scaling.z);
}

function updateWallHeight(height: number) {
    setWallHeight(height);
    walls.forEach(wall => wall.scaling.y = height / wall.scaling.y);
    ceiling.position.y = height;
}

function updateWallThickness(thickness: number) {
    setWallThickness(thickness);
    walls[0].scaling.z = thickness / walls[0].scaling.z;
    walls[1].scaling.z = thickness / walls[1].scaling.z;
    walls[2].scaling.x = thickness / walls[2].scaling.x;
    walls[3].scaling.x = thickness / walls[3].scaling.x;
    ceiling.scaling.y = thickness / ceiling.scaling.y;
}

export { updateDimensions, updateWallHeight, updateWallThickness };