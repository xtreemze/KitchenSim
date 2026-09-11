import {
    ActionManager,
    Animation,
    Color3,
    ExecuteCodeAction,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3
} from '@babylonjs/core';
import { SimulationStage } from '../../simulation/types';

type AvatarKind = 'adult' | 'child' | 'senior';

interface AvatarMember {
    label: string;
    mesh: Mesh;
    action: string;
    role: string;
}

type AvatarSelectionHandler = (label: string, action: string) => void;

const ACTION_BY_STAGE: Record<SimulationStage, string> = {
    'grocery-storage': 'Storing groceries',
    'meal-preparation': 'Preparing food',
    'meal-serving': 'Serving the meal',
    cleaning: 'Cleaning dishes and surfaces',
    'waste-disposal': 'Sorting and disposing waste'
};

const ROLE_BY_STAGE: Record<SimulationStage, string> = {
    'grocery-storage': 'Grocery Shopping',
    'meal-preparation': 'Cooking',
    'meal-serving': 'Setting Up',
    cleaning: 'Cleaning',
    'waste-disposal': 'Managing Waste'
};

export class KitchenHumans {
    private readonly avatars: AvatarMember[] = [];
    private selectionHandler: AvatarSelectionHandler | null = null;

    constructor(private readonly scene: Scene) {}

    setSelectionHandler(handler: AvatarSelectionHandler): void {
        this.selectionHandler = handler;
    }

    syncHousehold(size: number): void {
        const targetSize = Math.max(1, Math.min(12, Math.round(size)));
        while (this.avatars.length > targetSize) {
            this.avatars.pop()?.mesh.dispose();
        }
        while (this.avatars.length < targetSize) {
            const index = this.avatars.length;
            const kind: AvatarKind = index < 2 ? 'adult' : index === targetSize - 1 && targetSize > 6 ? 'senior' : 'child';
            this.avatars.push(this.createMember(kind, index));
        }
    }

    assignRoles(roles: readonly string[]): void {
        const availableRoles = roles.length > 0 ? roles : ['Cooking', 'Cleaning', 'Grocery Shopping', 'Managing Waste'];
        this.avatars.forEach((avatar, index) => {
            avatar.role = availableRoles[index % availableRoles.length];
            avatar.mesh.metadata = { ...(avatar.mesh.metadata ?? {}), role: avatar.role };
        });
    }

    performStage(stage: SimulationStage, dimensions: { width: number; length: number }): void {
        const workZone = this.getWorkZone(stage, dimensions);
        const preferredRole = ROLE_BY_STAGE[stage];
        const ordered = [...this.avatars].sort((left, right) => {
            const leftMatch = left.role === preferredRole ? 0 : 1;
            const rightMatch = right.role === preferredRole ? 0 : 1;
            return leftMatch - rightMatch;
        });

        ordered.forEach((avatar, index) => {
            const row = Math.floor(index / 3);
            const column = index % 3;
            const target = new Vector3(
                workZone.x + (column - 1) * 0.55,
                avatar.mesh.position.y,
                workZone.z + row * 0.55
            );
            Animation.CreateAndStartAnimation(
                `move-${avatar.label}`,
                avatar.mesh,
                'position',
                30,
                24,
                avatar.mesh.position.clone(),
                target,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            avatar.action = `${ACTION_BY_STAGE[stage]}${avatar.role === preferredRole ? ` (${avatar.role})` : ''}`;
            avatar.mesh.metadata = {
                ...(avatar.mesh.metadata ?? {}),
                action: avatar.action,
                role: avatar.role,
                stage
            };
        });
    }

    createAdult(position: Vector3): Mesh {
        return this.createStandalone('adult', position, 'Adult');
    }

    createChild(position: Vector3): Mesh {
        return this.createStandalone('child', position, 'Child');
    }

    createSenior(position: Vector3): Mesh {
        return this.createStandalone('senior', position, 'Senior');
    }

    private createMember(kind: AvatarKind, index: number): AvatarMember {
        const label = `Household member ${index + 1}`;
        const start = new Vector3((index % 4) * 0.7 - 1.05, 0, Math.floor(index / 4) * 0.7);
        const mesh = this.createStandalone(kind, start, label);
        const member: AvatarMember = { label, mesh, action: 'Waiting', role: 'Unassigned' };
        mesh.actionManager = new ActionManager(this.scene);
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
            this.selectionHandler?.(member.label, member.action);
        }));
        return member;
    }

    private createStandalone(kind: AvatarKind, position: Vector3, label: string): Mesh {
        const dimensions = kind === 'child'
            ? { height: 1.15, diameter: 0.48 }
            : kind === 'senior'
                ? { height: 1.7, diameter: 0.58 }
                : { height: 1.85, diameter: 0.62 };
        const mesh = MeshBuilder.CreateCylinder(`avatar-${label.toLowerCase().replace(/\s+/g, '-')}`, dimensions, this.scene);
        mesh.position = new Vector3(position.x, dimensions.height / 2, position.z);
        mesh.isPickable = true;
        const material = new StandardMaterial(`material-${mesh.name}`, this.scene);
        material.diffuseColor = kind === 'child'
            ? new Color3(0.28, 0.48, 0.82)
            : kind === 'senior'
                ? new Color3(0.58, 0.58, 0.64)
                : new Color3(0.78, 0.34, 0.28);
        mesh.material = material;
        mesh.metadata = { kind: 'avatar', label };
        return mesh;
    }

    private getWorkZone(stage: SimulationStage, dimensions: { width: number; length: number }): Vector3 {
        const halfWidth = dimensions.width / 2;
        const halfLength = dimensions.length / 2;
        const zones: Record<SimulationStage, Vector3> = {
            'grocery-storage': new Vector3(-halfWidth * 0.45, 0, -halfLength * 0.35),
            'meal-preparation': new Vector3(0, 0, -halfLength * 0.45),
            'meal-serving': new Vector3(0, 0, 0),
            cleaning: new Vector3(halfWidth * 0.28, 0, -halfLength * 0.4),
            'waste-disposal': new Vector3(halfWidth * 0.42, 0, halfLength * 0.3)
        };
        return zones[stage];
    }
}
