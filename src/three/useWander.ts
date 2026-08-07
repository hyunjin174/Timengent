import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import type { WalkState } from './VoxelAvatar';

const WALK_SPEED = 0.55; // units / second
const WANDER_RADIUS_MIN = 0.35;
const WANDER_RADIUS_MAX = 0.65;
const ARRIVE_EPSILON = 0.04;
const TWO_PI = Math.PI * 2;

function lerpAngle(from: number, to: number, t: number) {
  let diff = (to - from) % TWO_PI;
  if (diff > Math.PI) diff -= TWO_PI;
  else if (diff < -Math.PI) diff += TWO_PI;
  return from + diff * t;
}

/**
 * Ambient wandering, imperative and ref-driven throughout (no React state) so 3 characters
 * moving at 60fps never causes a re-render. Pauses whenever a mood reaction is playing —
 * feeding/praise/work animations expect the character to hold still — and resumes once idle.
 *
 * Position and facing are split across two refs: the outer group only ever translates (so the
 * speech-bubble/nameplate overlays it also parents stay upright), while the inner one rotates
 * to face the walk direction, independent of the character mesh's "resting" orientation.
 */
export function useWander(homeX: number, homeZ: number, homeRotation: number, isIdle: boolean) {
  const positionGroup = useRef<Group>(null);
  const facingGroup = useRef<Group>(null);
  const walkState = useRef<WalkState>({ isWalking: false });
  const target = useRef({ x: homeX, z: homeZ });
  const nextDecisionAt = useRef(3 + Math.random() * 5);

  useFrame((state, delta) => {
    const posGroup = positionGroup.current;
    const faceGroup = facingGroup.current;
    if (!posGroup || !faceGroup) return;

    const now = state.clock.elapsedTime;

    if (!isIdle) {
      target.current = { x: homeX, z: homeZ };
    } else if (now > nextDecisionAt.current) {
      const atHome = Math.hypot(posGroup.position.x - homeX, posGroup.position.z - homeZ) < 0.1;
      if (atHome && Math.random() < 0.65) {
        const angle = Math.random() * TWO_PI;
        const radius = WANDER_RADIUS_MIN + Math.random() * (WANDER_RADIUS_MAX - WANDER_RADIUS_MIN);
        target.current = { x: homeX + Math.cos(angle) * radius, z: homeZ + Math.sin(angle) * radius };
      } else {
        target.current = { x: homeX, z: homeZ };
      }
      nextDecisionAt.current = now + 5 + Math.random() * 7;
    }

    const dx = target.current.x - posGroup.position.x;
    const dz = target.current.z - posGroup.position.z;
    const dist = Math.hypot(dx, dz);
    const isWalking = dist > ARRIVE_EPSILON;
    walkState.current.isWalking = isWalking;

    if (isWalking) {
      const step = Math.min(dist, WALK_SPEED * delta);
      posGroup.position.x += (dx / dist) * step;
      posGroup.position.z += (dz / dist) * step;
      faceGroup.rotation.y = lerpAngle(faceGroup.rotation.y, Math.atan2(dx, dz), 0.15);
    } else {
      faceGroup.rotation.y = lerpAngle(faceGroup.rotation.y, homeRotation, 0.08);
    }
  });

  return { positionGroup, facingGroup, walkState };
}
