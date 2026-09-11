import { Animation, Mesh, Vector3 } from '@babylonjs/core';

export class InteractionHandler {
    handleInteraction(avatar: Mesh, object: Mesh): void {
        const target = object.getAbsolutePosition().add(new Vector3(0.55, 0, 0.55));
        target.y = avatar.position.y;
        Animation.CreateAndStartAnimation(
            `interact-${avatar.name}-${object.name}`,
            avatar,
            'position',
            30,
            20,
            avatar.position.clone(),
            target,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        avatar.metadata = {
            ...(avatar.metadata ?? {}),
            interactionTarget: object.name
        };
    }
}
