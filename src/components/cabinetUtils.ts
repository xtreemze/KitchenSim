import { MeshBuilder, Scene, Vector3, Mesh } from '@babylonjs/core';
import { createCabinetMaterial } from '../app/materials';

export function createHandle(name: string, parent: Mesh, position: Vector3, scene: Scene): void {
    const handle = MeshBuilder.CreateBox(name, { width: 0.02, height: 0.02, depth: 0.1 }, scene);
    handle.position = position;
    handle.parent = parent;
}

export function createHinge(name: string, parent: Mesh, position: Vector3, scene: Scene): void {
    const hinge = MeshBuilder.CreateCylinder(name, { diameter: 0.02, height: 0.1 }, scene);
    hinge.position = position;
    hinge.rotation.x = Math.PI / 2;
    hinge.parent = parent;
}

export function createShelf(name: string, parent: Mesh, position: Vector3, dimensions: { width: number, depth: number }, scene: Scene): void {
    const shelf = MeshBuilder.CreateBox(name, { width: dimensions.width, height: 0.02, depth: dimensions.depth }, scene);
    shelf.position = position;
    shelf.parent = parent;
}

export { createCabinetMaterial };