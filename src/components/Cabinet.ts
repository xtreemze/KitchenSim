import { MeshBuilder, Scene, Vector3, Animation, TransformNode } from '@babylonjs/core';
import { createCabinetMaterial, createHandle, createHinge } from './cabinetUtils';

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
    minHeightAboveGround: 0.5,
    maxHeight: 300,
    alignmentGrid: 1, // Snap positioning to 1cm grid
};

const DEFAULT_SCENE_BOUNDS = {
    x: 500,
    y: 300,
    z: 500
};

const SHELF_THICKNESS = 0.02;
const HANDLE_DIMENSIONS = { width: 0.02, height: 0.02, depth: 0.1 };
const DRAWER_SLIDE_DIMENSIONS = { width: 0.02, height: 0.02 };
const DRAWER_ANIMATION_FRAMES = 30;
const DRAWER_ANIMATION_DISTANCE = 0.3;
const DOOR_ANIMATION_FRAMES = 30;
const DOOR_ANIMATION_ANGLE = Math.PI / 2;
const SHELF_SPACING = 30; // cm
const HANDLE_OFFSET = 0.01;
const HINGE_OFFSET = 0.05;
const HINGE_DEPTH_OFFSET = 0.03;

// Apply position constraints
function applyPositionConstraints(position: Vector3, constraints: typeof POSITION_CONSTRAINTS): Vector3 {
    position.x = Math.round(position.x / constraints.alignmentGrid) * constraints.alignmentGrid;
    position.z = Math.round(position.z / constraints.alignmentGrid) * constraints.alignmentGrid;
    position.y = Math.max(constraints.minHeightAboveGround, Math.min(position.y, constraints.maxHeight));
    return position;
}

// Adjust position for height
function adjustPositionForHeight(position: Vector3, idealHeight: number, floorHeight: number = 0.05): Vector3 {
    return new Vector3(position.x, floorHeight + position.y + idealHeight / 100, position.z);
}

// Ensure position is within bounds
function ensureWithinBounds(position: Vector3, bounds: typeof DEFAULT_SCENE_BOUNDS): Vector3 {
    position.x = Math.min(Math.max(position.x, -bounds.x / 2), bounds.x / 2);
    position.y = Math.min(Math.max(position.y, 0), bounds.y);
    position.z = Math.min(Math.max(position.z, -bounds.z / 2), bounds.z / 2);
    return position;
}

// Validate cabinet configuration
function validateConfig(config: typeof CABINET_CONFIG[0]): void {
    if (!config.name || !config.dimensions || !config.materials) {
        throw new Error("Invalid cabinet configuration");
    }
}

// Generate procedural geometry for the cabinet
function createCabinetGeometry(config: { name: string; dimensions: { width: number; height: number; depth: number }; weight: number; materials: string; colors: string[]; idealHeight: number }, scene: Scene): TransformNode {
    // Create an origin point for the cabinet
    const origin = new TransformNode(config.name + "_origin", scene);

    // Outer shell
    const shell = MeshBuilder.CreateBox("shell", {
        width: config.dimensions.width / 100, // Convert to meters
        height: config.dimensions.height / 100, // Convert to meters
        depth: config.dimensions.depth / 100, // Convert to meters
    }, scene);
    shell.position = new Vector3(0, config.dimensions.height / 200, 0); // Centered vertically
    shell.material = createCabinetMaterial(scene, config.colors[0], config.materials.split(", ")[0]);
    shell.parent = origin;

    // Internal shelves
    const shelfCount = Math.floor(config.dimensions.height / SHELF_SPACING); // Example: shelves every 30 cm
    for (let i = 1; i < shelfCount; i++) {
        const shelf = MeshBuilder.CreateBox(`shelf${i}`, {
            width: (config.dimensions.width - 4) / 100, // Adjusted to fit inside the cabinet, convert to meters
            height: SHELF_THICKNESS, // Thin shelf
            depth: (config.dimensions.depth - 4) / 100, // Adjusted to fit inside the cabinet, convert to meters
        }, scene);
        shelf.position = new Vector3(0, (config.dimensions.height / 100) * (i / shelfCount) - (config.dimensions.height / 200), 0);
        shelf.parent = origin;
    }

    // Doors or drawers
    if (config.name.includes("Drawer")) {
        const drawerCount = 3; // Example: 3 drawers
        for (let i = 0; i < drawerCount; i++) {
            const drawer = MeshBuilder.CreateBox(`drawer${i}`, {
                width: (config.dimensions.width - 4) / 100, // Adjusted to fit inside the cabinet, convert to meters
                height: (config.dimensions.height / drawerCount - 4) / 100, // Adjusted to fit inside the cabinet, convert to meters
                depth: (config.dimensions.depth - 4) / 100, // Adjusted to fit inside the cabinet, convert to meters
            }, scene);
            drawer.position = new Vector3(0, (config.dimensions.height / 100) * (i / drawerCount) - (config.dimensions.height / 200) + (config.dimensions.height / (2 * drawerCount)) / 100, config.dimensions.depth / 200);
            drawer.parent = origin;

            // Add drawer animation
            const drawerAnimation = new Animation(`drawerAnimation${i}`, "position.z", DRAWER_ANIMATION_FRAMES, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            const drawerKeys = [
                { frame: 0, value: drawer.position.z },
                { frame: DRAWER_ANIMATION_FRAMES, value: drawer.position.z + DRAWER_ANIMATION_DISTANCE }
            ];
            drawerAnimation.setKeys(drawerKeys);
            drawer.animations = [drawerAnimation];

            // Add handle to drawer
            createHandle(`handle${i}`, drawer, new Vector3(0, 0, config.dimensions.depth / 200 + HANDLE_DIMENSIONS.depth), scene);

            // Add drawer slides
            const slideLeft = MeshBuilder.CreateBox(`slideLeft${i}`, DRAWER_SLIDE_DIMENSIONS, scene);
            slideLeft.position = new Vector3(-config.dimensions.width / 200 + HANDLE_OFFSET, 0, 0);
            slideLeft.parent = drawer;

            const slideRight = MeshBuilder.CreateBox(`slideRight${i}`, DRAWER_SLIDE_DIMENSIONS, scene);
            slideRight.position = new Vector3(config.dimensions.width / 200 - HANDLE_OFFSET, 0, 0);
            slideRight.parent = drawer;
        }
    } else {
        const doorLeft = MeshBuilder.CreateBox("doorLeft", {
            width: (config.dimensions.width / 200), // Convert to meters
            height: (config.dimensions.height / 100), // Convert to meters
            depth: 0.02,
        }, scene);
        doorLeft.position = new Vector3(
            -(config.dimensions.width / 400),
            0,
            config.dimensions.depth / 200
        );
        doorLeft.parent = origin;

        const doorRight = MeshBuilder.CreateBox("doorRight", {
            width: (config.dimensions.width / 200), // Convert to meters
            height: (config.dimensions.height / 100), // Convert to meters
            depth: 0.02,
        }, scene);
        doorRight.position = new Vector3(
            config.dimensions.width / 400,
            0,
            config.dimensions.depth / 200
        );
        doorRight.parent = origin;

        if (config.name.includes("Glass Door")) {
            doorLeft.material = createCabinetMaterial(scene, config.colors[1], "Glass");
            doorRight.material = createCabinetMaterial(scene, config.colors[1], "Glass");
        }

        // Add door animations
        const doorLeftAnimation = new Animation("doorLeftAnimation", "rotation.y", DOOR_ANIMATION_FRAMES, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const doorRightAnimation = new Animation("doorRightAnimation", "rotation.y", DOOR_ANIMATION_FRAMES, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const doorKeys = [
            { frame: 0, value: DOOR_ANIMATION_ANGLE }, // Start open
            { frame: DOOR_ANIMATION_FRAMES, value: DOOR_ANIMATION_ANGLE }
        ];
        doorLeftAnimation.setKeys(doorKeys);
        doorRightAnimation.setKeys(doorKeys.map(key => ({ frame: key.frame, value: -key.value })));
        doorLeft.animations = [doorLeftAnimation];
        doorRight.animations = [doorRightAnimation];

        // Add handles to doors
        createHandle("handleLeft", doorLeft, new Vector3(-(config.dimensions.width / 400) - HANDLE_DIMENSIONS.width, 0, config.dimensions.depth / 200 + HANDLE_DIMENSIONS.depth), scene);
        createHandle("handleRight", doorRight, new Vector3(config.dimensions.width / 400 + HANDLE_OFFSET, 0, config.dimensions.depth / 200 + HANDLE_DIMENSIONS.depth), scene);

        // Add hinges to doors
        createHinge("hingeLeft", doorLeft, new Vector3(-(config.dimensions.width / 400) - HANDLE_OFFSET, config.dimensions.height / 200 - (config.dimensions.height / 200) + HINGE_OFFSET, config.dimensions.depth / 200 - HINGE_DEPTH_OFFSET), scene);
        createHinge("hingeRight", doorRight, new Vector3(config.dimensions.width / 400 + HANDLE_OFFSET, config.dimensions.height / 200 - (config.dimensions.height / 200) + HINGE_OFFSET, config.dimensions.depth / 200 - HINGE_DEPTH_OFFSET), scene);
    }

    return origin;
}

// Generate a cabinet dynamically
export function generateCabinet(type: string, position: Vector3, scene: Scene, sceneBounds: typeof DEFAULT_SCENE_BOUNDS = DEFAULT_SCENE_BOUNDS): void {
    try {
        const config = CABINET_CONFIG.find((c) => c.name === type);
        if (!config) {
            throw new Error("Invalid cabinet type: " + type);
        }

        validateConfig(config);

        position = applyPositionConstraints(position, POSITION_CONSTRAINTS);
        position = adjustPositionForHeight(position, config.idealHeight);
        position = ensureWithinBounds(position, sceneBounds);

        const cabinetGeometry = createCabinetGeometry(config, scene);
        cabinetGeometry.position = position;

        // Start animations
        scene.beginAnimation(cabinetGeometry, 0, 30, false);

        // Save cabinet configuration and positioning for tracking
        console.log("Cabinet created:", {
            type: config.name,
            dimensions: config.dimensions,
            position: cabinetGeometry.position,
            weight: config.weight,
            materials: config.materials,
        });
    } catch (error) {
        console.error("Failed to create cabinet:", error);
    }
}
