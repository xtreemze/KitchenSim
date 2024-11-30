import { Scene, StandardMaterial, Color3, NoiseProceduralTexture } from '@babylonjs/core';
import { MarbleProceduralTexture, WoodProceduralTexture, GrassProceduralTexture } from '@babylonjs/procedural-textures';

export function createMarbleMaterial(scene: Scene): StandardMaterial {
    const marbleMaterial = new StandardMaterial("marbleMat", scene);
    const marbleTexture = new MarbleProceduralTexture("marbleTex", 1024, scene);
    marbleTexture.numberOfTilesHeight = 8;
    marbleTexture.numberOfTilesWidth = 8;
    marbleMaterial.ambientTexture = marbleTexture;
    return marbleMaterial;
}

export function createWoodMaterial(scene: Scene): StandardMaterial {
    const woodMaterial = new StandardMaterial("woodMat", scene);
    const woodTexture = new WoodProceduralTexture("woodTex", 1024, scene);
    woodTexture.ampScale = 80.0;
    woodMaterial.diffuseTexture = woodTexture;
    woodMaterial.backFaceCulling = false; // Ensure the material is visible from inside
    woodMaterial.alpha = 0.5; // Make the outer side transparent
    return woodMaterial;
}

export function createGrassMaterial(scene: Scene): StandardMaterial {
    const grassMaterial = new StandardMaterial("grassMat", scene);
    const grassTexture = new GrassProceduralTexture("grassTex", 2048, scene);
    grassMaterial.diffuseTexture = grassTexture;
    return grassMaterial;
}

export function createCabinetMaterial(scene: Scene, color: string, materialType: string): StandardMaterial {
    const material = new StandardMaterial("material", scene);

    switch (materialType) {
        case "Particleboard":
            material.diffuseColor = new Color3(0.8, 0.7, 0.6); // Light brown
            material.specularColor = new Color3(0.1, 0.1, 0.1);
            break;
        case "Foil":
            material.diffuseColor = new Color3(0.9, 0.9, 0.9); // Light grey
            material.specularColor = new Color3(0.2, 0.2, 0.2);
            break;
        case "Glass":
            material.diffuseColor = new Color3(0.9, 0.9, 1.0); // Light blue
            material.specularColor = new Color3(0.5, 0.5, 0.5);
            material.alpha = 0.5;
            break;
        default:
            material.diffuseColor = Color3.FromHexString(color); // Default to provided color
            material.specularColor = new Color3(0.1, 0.1, 0.1);
            break;
    }

    // Generate noise texture for realistic surface
    const noiseTexture = new NoiseProceduralTexture("noise", 32, scene);
    noiseTexture.animationSpeedFactor = 0;
    noiseTexture.persistence = 2;
    noiseTexture.brightness = 0.5;
    noiseTexture.octaves = 4;
    material.bumpTexture = noiseTexture;

    return material;
}