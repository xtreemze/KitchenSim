import { Scene, Vector3 } from '@babylonjs/core';
import { generateCabinet } from '../components/Cabinet';
import { KitchenHumans } from '../components/avatars/KitchenHumans';

const FLOOR_Y_POSITION = 0.5;

export function loadCabinets(scene: Scene): void {
    const cabinets = [
        { type: "Base Cabinet", position: new Vector3(-6, FLOOR_Y_POSITION, 0) },
        { type: "Drawer Base Cabinet", position: new Vector3(-4, FLOOR_Y_POSITION, 0) },
        { type: "Corner Base Cabinet", position: new Vector3(-2, FLOOR_Y_POSITION, 0) },
        { type: "Tall Cabinet", position: new Vector3(0, FLOOR_Y_POSITION, 0) },
        { type: "Wall Cabinet", position: new Vector3(2, FLOOR_Y_POSITION, 0) },
        { type: "Glass Door Wall Cabinet", position: new Vector3(4, FLOOR_Y_POSITION, 0) },
        { type: "Pantry Cabinet", position: new Vector3(6, FLOOR_Y_POSITION, 0) }
    ];

    cabinets.forEach(cabinet => generateCabinet(cabinet.type, cabinet.position, scene));

    const kitchenHumans = new KitchenHumans(scene);
    kitchenHumans.createAdult(new Vector3(0, FLOOR_Y_POSITION, -2));
    kitchenHumans.createChild(new Vector3(2, FLOOR_Y_POSITION, -2));
}
