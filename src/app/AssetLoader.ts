import { Scene, Vector3 } from '@babylonjs/core';
import { generateCabinet } from '../components/Cabinet';

export function loadCabinets(scene: Scene): void {
    const cabinets = [
        { type: "Base Cabinet", position: new Vector3(-6, 1, 0) },
        { type: "Drawer Base Cabinet", position: new Vector3(-4, 1, 0) },
        { type: "Corner Base Cabinet", position: new Vector3(-2, 1, 0) },
        { type: "Tall Cabinet", position: new Vector3(0, 1, 0) },
        { type: "Wall Cabinet", position: new Vector3(2, 1, 0) },
        { type: "Glass Door Wall Cabinet", position: new Vector3(4, 1, 0) },
        { type: "Pantry Cabinet", position: new Vector3(6, 1, 0) }
    ];

    cabinets.forEach(cabinet => generateCabinet(cabinet.type, cabinet.position, scene));
}
