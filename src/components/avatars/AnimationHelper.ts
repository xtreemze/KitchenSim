import { Animation, Mesh, Vector3 } from '@babylonjs/core';

export class AnimationHelper {
    static createWalkingAnimation(mesh: Mesh, target: Vector3): void {
        Animation.CreateAndStartAnimation(
            `walk-${mesh.name}`,
            mesh,
            'position',
            30,
            24,
            mesh.position.clone(),
            target,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    }

    static createReachingAnimation(mesh: Mesh): void {
        const start = mesh.rotation.x;
        Animation.CreateAndStartAnimation(
            `reach-${mesh.name}`,
            mesh,
            'rotation.x',
            30,
            16,
            start,
            start - 0.18,
            Animation.ANIMATIONLOOPMODE_YOYO
        );
    }
}
