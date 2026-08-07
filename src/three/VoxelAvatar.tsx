import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import type { Mood, PixelPalette } from '../types/avatar';
import { PART } from './palette';

/**
 * A chibi character built entirely from boxes (voxel style), colored from the same
 * palette indices the 2D sprite uses. The model faces +z at rotation 0.
 */
interface VoxelAvatarProps {
  palette: PixelPalette;
  mood: Mood;
  /** Slight per-character phase offset so a room full of avatars doesn't bob in lockstep. */
  phase?: number;
}

export function VoxelAvatar({ palette, mood, phase = 0 }: VoxelAvatarProps) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const armL = useRef<Mesh>(null);
  const armR = useRef<Mesh>(null);
  const moodStart = useRef(0);

  const hair = palette[PART.hair];
  const skin = palette[PART.skin];
  const eyes = palette[PART.eyes];
  const shirt = palette[PART.shirt];
  const pants = palette[PART.pants];
  const shoes = palette[PART.shoes];

  // Reset the animation clock whenever the mood changes so one-shot reactions
  // (jump, munch) always play from their start rather than mid-cycle.
  useEffect(() => {
    moodStart.current = -1;
  }, [mood]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (moodStart.current < 0) moodStart.current = t;
    const since = t - moodStart.current;
    const bob = Math.sin(t * 2.4 + phase) * 0.02;

    if (!root.current || !head.current || !armL.current || !armR.current) return;

    if (mood === 'praised') {
      // Two happy hops with arms thrown up.
      const hop = Math.max(0, Math.sin(since * 7)) * 0.28;
      root.current.position.y = hop;
      root.current.rotation.z = Math.sin(since * 7) * 0.05;
      armL.current.rotation.x = -2.4;
      armR.current.rotation.x = -2.4;
      head.current.rotation.z = Math.sin(since * 7) * 0.12;
    } else if (mood === 'eating') {
      // Hands to mouth, head nodding as it munches.
      root.current.position.y = bob;
      root.current.rotation.z = 0;
      armL.current.rotation.x = -1.9;
      armR.current.rotation.x = -1.9;
      head.current.rotation.x = Math.sin(since * 12) * 0.12;
      head.current.rotation.z = 0;
    } else if (mood === 'working') {
      // Leaning in, arms tapping away at the desk.
      root.current.position.y = bob * 0.4;
      root.current.rotation.z = 0;
      root.current.rotation.x = 0.1;
      armL.current.rotation.x = -1.2 + Math.sin(since * 14) * 0.18;
      armR.current.rotation.x = -1.2 + Math.sin(since * 14 + Math.PI) * 0.18;
      head.current.rotation.x = 0.18;
      head.current.rotation.z = 0;
    } else {
      // Idle: breathe, sway arms, glance around now and then.
      root.current.position.y = bob;
      root.current.rotation.x = 0;
      root.current.rotation.z = 0;
      armL.current.rotation.x = Math.sin(t * 1.6 + phase) * 0.14;
      armR.current.rotation.x = -Math.sin(t * 1.6 + phase) * 0.14;
      head.current.rotation.x = 0;
      head.current.rotation.y = Math.sin(t * 0.5 + phase) * 0.35;
      head.current.rotation.z = 0;
    }
  });

  return (
    <group ref={root}>
      {/* legs + shoes */}
      {[-0.13, 0.13].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.28, 0]}>
            <boxGeometry args={[0.17, 0.36, 0.18]} />
            <meshLambertMaterial color={pants} />
          </mesh>
          <mesh position={[x, 0.06, 0.01]}>
            <boxGeometry args={[0.19, 0.12, 0.22]} />
            <meshLambertMaterial color={shoes} />
          </mesh>
        </group>
      ))}

      {/* torso */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.52, 0.58, 0.3]} />
        <meshLambertMaterial color={shirt} />
      </mesh>

      {/* arms — pivot at the shoulder so rotation.x swings them naturally */}
      <mesh ref={armL} position={[-0.33, 1.0, 0]}>
        <boxGeometry args={[0.14, 0.5, 0.18]} />
        <meshLambertMaterial color={shirt} />
      </mesh>
      <mesh ref={armR} position={[0.33, 1.0, 0]}>
        <boxGeometry args={[0.14, 0.5, 0.18]} />
        <meshLambertMaterial color={shirt} />
      </mesh>

      {/* head group: skull, hair cap, fringe, eyes */}
      <group ref={head} position={[0, 1.36, 0]}>
        <mesh>
          <boxGeometry args={[0.62, 0.6, 0.56]} />
          <meshLambertMaterial color={skin} />
        </mesh>
        <mesh position={[0, 0.31, 0]}>
          <boxGeometry args={[0.66, 0.14, 0.6]} />
          <meshLambertMaterial color={hair} />
        </mesh>
        <mesh position={[0, 0.16, -0.02]}>
          <boxGeometry args={[0.66, 0.2, 0.62]} />
          <meshLambertMaterial color={hair} />
        </mesh>
        <mesh position={[0, 0.12, 0.29]}>
          <boxGeometry args={[0.64, 0.12, 0.06]} />
          <meshLambertMaterial color={hair} />
        </mesh>
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, -0.02, 0.29]}>
            <boxGeometry args={[0.09, 0.11, 0.04]} />
            <meshBasicMaterial color={eyes} />
          </mesh>
        ))}
        {/* Blush + mouth keep the face from reading as a blank block at low resolution. */}
        {[-0.24, 0.24].map((x) => (
          <mesh key={x} position={[x, -0.12, 0.28]}>
            <boxGeometry args={[0.1, 0.06, 0.03]} />
            <meshBasicMaterial color="#ff9aa8" />
          </mesh>
        ))}
        <mesh position={[0, -0.16, 0.29]}>
          <boxGeometry args={[0.11, 0.05, 0.03]} />
          <meshBasicMaterial color={eyes} />
        </mesh>
      </group>
    </group>
  );
}
