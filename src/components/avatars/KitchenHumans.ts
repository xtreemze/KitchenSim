import { Mesh, Scene, Vector3, StandardMaterial, Color3 } from '@babylonjs/core';

const FLOOR_Y_POSITION = 0;
const ADULT_HEIGHT = 2;
const ADULT_RADIUS = 0.8;
const CHILD_HEIGHT = 1;
const CHILD_RADIUS = 0.5;
const SENIOR_HEIGHT = 1.8;
const SENIOR_RADIUS = 0.7;

export class KitchenHumans {
    private scene: Scene;
    private avatars: Mesh[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createAdult(position: Vector3): Mesh {
        const adjustedPosition = new Vector3(position.x, FLOOR_Y_POSITION + ADULT_HEIGHT / 2, position.z);
        const adult = Mesh.CreateCylinder('adult', ADULT_HEIGHT, ADULT_RADIUS, ADULT_RADIUS, 20, 1, this.scene);
        adult.position = adjustedPosition;

        const adultMaterial = new StandardMaterial("adultMaterial", this.scene);
        adultMaterial.diffuseColor = new Color3(0.8, 0.2, 0.2); // Red color
        adult.material = adultMaterial;

        this.avatars.push(adult);
        return adult;
    }

    createChild(position: Vector3): Mesh {
        const adjustedPosition = new Vector3(position.x, FLOOR_Y_POSITION + CHILD_HEIGHT / 2, position.z);
        const child = Mesh.CreateCylinder('child', CHILD_HEIGHT, CHILD_RADIUS, CHILD_RADIUS, 20, 1, this.scene);
        child.position = adjustedPosition;

        const childMaterial = new StandardMaterial("childMaterial", this.scene);
        childMaterial.diffuseColor = new Color3(0.2, 0.2, 0.8); // Blue color
        child.material = childMaterial;

        this.avatars.push(child);
        return child;
    }

    createSenior(position: Vector3): Mesh {
        const adjustedPosition = new Vector3(position.x, FLOOR_Y_POSITION + SENIOR_HEIGHT / 2, position.z);
        const senior = Mesh.CreateCylinder('senior', SENIOR_HEIGHT, SENIOR_RADIUS, SENIOR_RADIUS, 20, 1, this.scene);
        senior.position = adjustedPosition;

        const seniorMaterial = new StandardMaterial("seniorMaterial", this.scene);
        seniorMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5); // Grey color
        senior.material = seniorMaterial;

        this.avatars.push(senior);
        return senior;
    }
}