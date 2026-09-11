import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';
import { generateCabinet } from '../components/Cabinet';
import { RecyclingRegion, WasteCategory } from '../simulation/types';

let cabinetRoots: TransformNode[] = [];
let applianceMeshes: Mesh[] = [];
let wasteMeshes: Mesh[] = [];

function disposeMeshes(meshes: Mesh[]): void {
    meshes.forEach((mesh) => {
        mesh.material?.dispose();
        mesh.dispose();
    });
    meshes.length = 0;
}

function disposeCabinets(): void {
    cabinetRoots.forEach((node) => node.dispose(false, true));
    cabinetRoots = [];
}

export function loadCabinets(scene: Scene): void {
    syncKitchenLayout(scene, { width: 10, length: 10 });
}

export function syncKitchenLayout(scene: Scene, dimensions: { width: number; length: number }): void {
    disposeCabinets();

    const cabinetTypes = [
        'Base Cabinet',
        'Drawer Base Cabinet',
        'Wall Cabinet',
        'Glass Door Wall Cabinet',
        'Tall Cabinet',
        'Pantry Cabinet'
    ];
    const usableWidth = Math.max(3, dimensions.width - 1.4);
    const cabinetCount = Math.max(4, Math.min(12, Math.floor(usableWidth / 0.85)));
    const spacing = usableWidth / cabinetCount;
    const z = -dimensions.length / 2 + 0.75;

    for (let index = 0; index < cabinetCount; index += 1) {
        const x = -usableWidth / 2 + spacing * (index + 0.5);
        const before = new Set(scene.transformNodes);
        generateCabinet(cabinetTypes[index % cabinetTypes.length], new Vector3(x, 0, z), scene);
        const root = scene.transformNodes.find((node) => !before.has(node));
        if (root) {
            root.metadata = { ...(root.metadata ?? {}), kitchenLayout: true };
            cabinetRoots.push(root);
        }
    }
}

export function syncAppliances(
    scene: Scene,
    appliancesEnabled: readonly string[],
    dimensions: { width: number; length: number }
): void {
    disposeMeshes(applianceMeshes);
    const spacing = Math.min(1.4, Math.max(0.9, (dimensions.width - 2) / Math.max(1, appliancesEnabled.length)));
    const startX = -((appliancesEnabled.length - 1) * spacing) / 2;
    const z = dimensions.length / 2 - 0.8;

    appliancesEnabled.forEach((appliance, index) => {
        const height = appliance === 'Oven' || appliance === 'Dishwasher' ? 0.85 : 0.45;
        const mesh = MeshBuilder.CreateBox(`appliance-${appliance.toLowerCase()}`, {
            width: 0.65,
            height,
            depth: 0.55
        }, scene);
        mesh.position = new Vector3(startX + index * spacing, height / 2, z);
        mesh.metadata = { kind: 'appliance', appliance };
        const material = new StandardMaterial(`material-${mesh.name}`, scene);
        material.diffuseColor = new Color3(0.16, 0.19, 0.22);
        mesh.material = material;
        applianceMeshes.push(mesh);
    });
}

export function syncWasteStations(
    scene: Scene,
    categories: readonly WasteCategory[],
    region: RecyclingRegion,
    dimensions: { width: number; length: number }
): void {
    disposeMeshes(wasteMeshes);
    const visibleCategories = categories.length > 0 ? categories : ['General' as WasteCategory];
    const z = Math.min(dimensions.length / 2 - 0.8, 1.8);
    const baseX = dimensions.width / 2 - 0.7;

    visibleCategories.forEach((category, index) => {
        const mesh = MeshBuilder.CreateCylinder(`waste-${category.toLowerCase()}`, {
            height: 0.7,
            diameter: 0.42
        }, scene);
        mesh.position = new Vector3(baseX - (index % 2) * 0.55, 0.35, z - Math.floor(index / 2) * 0.55);
        mesh.metadata = { kind: 'waste-station', category, region };
        const material = new StandardMaterial(`material-${mesh.name}`, scene);
        const hue = (index + 1) / (visibleCategories.length + 1);
        material.diffuseColor = new Color3(0.25 + hue * 0.4, 0.55 - hue * 0.2, 0.35 + hue * 0.3);
        mesh.material = material;
        wasteMeshes.push(mesh);
    });
}
