import { MeshBuilder, Scene, PBRMaterial, Color3, Vector3, Mesh, NoiseProceduralTexture } from '@babylonjs/core';

// Configuration for IKEA cabinet dimensions and properties
const CABINET_CONFIG = [
    {
        name: "Base Cabinet",
        dimensions: { width: 60, height: 80, depth: 60 },
        weight: 30,
        materials: "Particleboard, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 0, // Ideal height placement in cm
    },
    {
        name: "Wall Cabinet",
        dimensions: { width: 60, height: 40, depth: 35 },
        weight: 15,
        materials: "Particleboard, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 150, // Ideal height placement in cm
    },
    {
        name: "Tall Cabinet",
        dimensions: { width: 60, height: 200, depth: 60 },
        weight: 60,
        materials: "Particleboard, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 0, // Ideal height placement in cm
    },
    {
        name: "Corner Base Cabinet",
        dimensions: { width: 90, height: 80, depth: 90 },
        weight: 40,
        materials: "Particleboard, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 0, // Ideal height placement in cm
    },
    {
        name: "Drawer Base Cabinet",
        dimensions: { width: 60, height: 80, depth: 60 },
        weight: 35,
        materials: "Particleboard, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 0, // Ideal height placement in cm
    },
    {
        name: "Glass Door Wall Cabinet",
        dimensions: { width: 60, height: 40, depth: 35 },
        weight: 20,
        materials: "Particleboard, Glass, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 150, // Ideal height placement in cm
    },
    {
        name: "Pantry Cabinet",
        dimensions: { width: 60, height: 220, depth: 60 },
        weight: 70,
        materials: "Particleboard, Foil",
        colors: ["#D3D3D3", "#A9A9A9", "#696969"], // Light Grey, Dark Grey, Dim Grey
        idealHeight: 0, // Ideal height placement in cm
    },
];

// Rules for positioning and constraints
const POSITION_CONSTRAINTS = {
    minHeightAboveGround: 1,
    maxHeight: 300,
    alignmentGrid: 2, // Snap positioning to 10cm grid
};


// Utility function to create procedural PBR materials
function createCabinetPBRMaterial(scene: Scene, color: string, materialType: string): PBRMaterial {
    const pbr = new PBRMaterial("pbr", scene);

    switch (materialType) {
        case "Particleboard":
            pbr.albedoColor = new Color3(0.8, 0.7, 0.6); // Light brown
            pbr.metallic = 0.0;
            pbr.roughness = 0.9;
            break;
        case "Foil":
            pbr.albedoColor = new Color3(0.9, 0.9, 0.9); // Light grey
            pbr.metallic = 0.1;
            pbr.roughness = 0.8;
            break;
        case "Glass":
            pbr.albedoColor = new Color3(0.9, 0.9, 1.0); // Light blue
            pbr.metallic = 0.5;
            pbr.roughness = 0.1;
            pbr.alpha = 0.5;
            break;
        default:
            pbr.albedoColor = Color3.FromHexString(color); // Default to provided color
            pbr.metallic = 0.0;
            pbr.roughness = 0.9;
            break;
    }

    // Generate noise texture for realistic surface
    const noiseTexture = new NoiseProceduralTexture("noise", 32, scene);
    noiseTexture.animationSpeedFactor = 0;
    noiseTexture.persistence = 2;
    noiseTexture.brightness = 0.5;
    noiseTexture.octaves = 4;
    pbr.bumpTexture = noiseTexture;

    return pbr;
}

// Generate procedural geometry for the cabinet
function createCabinetGeometry(config: { name: string; dimensions: { width: number; height: number; depth: number }; weight: number; materials: string; colors: string[]; idealHeight: number }, scene: Scene): Mesh {
    // Outer shell
    const shell = MeshBuilder.CreateBox("shell", {
        width: config.dimensions.width / 100,
        height: config.dimensions.height / 100,
        depth: config.dimensions.depth / 100,
    });
    shell.position = new Vector3(0, config.idealHeight / 100 + config.dimensions.height / 200, 0); // Elevate half-height plus ideal height
    shell.material = createCabinetPBRMaterial(scene, config.colors[0], config.materials.split(", ")[0]);

    // Internal shelves
    const shelfCount = Math.floor(config.dimensions.height / 30); // Example: shelves every 30 cm
    for (let i = 1; i < shelfCount; i++) {
        const shelf = MeshBuilder.CreateBox(`shelf${i}`, {
            width: (config.dimensions.width - 4) / 100, // Adjusted to fit inside the cabinet
            height: 0.02, // Thin shelf
            depth: (config.dimensions.depth - 4) / 100, // Adjusted to fit inside the cabinet
        });
        shelf.position = new Vector3(0, (config.dimensions.height / 100) * (i / shelfCount) - (config.dimensions.height / 200), 0);
        shelf.parent = shell;
    }

    // Doors or drawers
    if (config.name.includes("Drawer")) {
        const drawerCount = 3; // Example: 3 drawers
        for (let i = 0; i < drawerCount; i++) {
            const drawer = MeshBuilder.CreateBox(`drawer${i}`, {
                width: (config.dimensions.width - 4) / 100, // Adjusted to fit inside the cabinet
                height: (config.dimensions.height / drawerCount - 4) / 100, // Adjusted to fit inside the cabinet
                depth: (config.dimensions.depth - 4) / 100, // Adjusted to fit inside the cabinet
            });
            drawer.position = new Vector3(0, (config.dimensions.height / 100) * (i / drawerCount) - (config.dimensions.height / 200) + (config.dimensions.height / (2 * drawerCount)) / 100, config.dimensions.depth / 200);
            drawer.parent = shell;
        }
    } else {
        const doorLeft = MeshBuilder.CreateBox("doorLeft", {
            width: (config.dimensions.width / 200),
            height: (config.dimensions.height / 100),
            depth: 0.02,
        });
        doorLeft.position = new Vector3(
            -(config.dimensions.width / 400),
            config.dimensions.height / 200 - (config.dimensions.height / 200),
            config.dimensions.depth / 200
        );
        doorLeft.parent = shell;

        const doorRight = MeshBuilder.CreateBox("doorRight", {
            width: (config.dimensions.width / 200),
            height: (config.dimensions.height / 100),
            depth: 0.02,
        });
        doorRight.position = new Vector3(
            config.dimensions.width / 400,
            config.dimensions.height / 200 - (config.dimensions.height / 200),
            config.dimensions.depth / 200
        );
        doorRight.parent = shell;

        if (config.name.includes("Glass Door")) {
            doorLeft.material = createCabinetPBRMaterial(scene, config.colors[1], "Glass");
            doorRight.material = createCabinetPBRMaterial(scene, config.colors[1], "Glass");
        }
    }

    return shell;
}

// Generate a cabinet dynamically
export function generateCabinet(type: string, position: Vector3, scene: Scene): void {
    const config = CABINET_CONFIG.find((c) => c.name === type);
    if (!config) {
        console.error("Invalid cabinet type:", type);
        return;
    }

    const cabinetGeometry = createCabinetGeometry(config, scene);

    // Apply logical constraints for positioning
    position.x = Math.round(position.x / POSITION_CONSTRAINTS.alignmentGrid) * POSITION_CONSTRAINTS.alignmentGrid;
    position.z = Math.round(position.z / POSITION_CONSTRAINTS.alignmentGrid) * POSITION_CONSTRAINTS.alignmentGrid;
    position.y = Math.max(POSITION_CONSTRAINTS.minHeightAboveGround, Math.min(position.y, POSITION_CONSTRAINTS.maxHeight));

    cabinetGeometry.position = new Vector3(position.x, position.y + config.idealHeight / 100, position.z);

    // Save cabinet configuration and positioning for tracking
    console.log("Cabinet created:", {
        type: config.name,
        dimensions: config.dimensions,
        position: cabinetGeometry.position,
        weight: config.weight,
        materials: config.materials,
    });
}
