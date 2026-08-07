import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import type { AvatarState } from '../types/avatar';
import { MiniRoom } from './MiniRoom';
import { RoomAvatar3D } from './RoomAvatar3D';

/**
 * Rendering at a fraction of device resolution and letting CSS upscale the canvas with
 * `image-rendering: pixelated` is what keeps a real 3D scene looking like retro dot art.
 */
const PIXEL_DPR = 0.42;

interface MiniRoomSceneProps {
  avatars: AvatarState[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MiniRoomScene({ avatars, selectedId, onSelect }: MiniRoomSceneProps) {
  return (
    <Canvas
      orthographic
      dpr={PIXEL_DPR}
      gl={{ antialias: false }}
      camera={{ position: [10, 8.5, 11], zoom: 66, near: -100, far: 200 }}
      style={{ imageRendering: 'pixelated', touchAction: 'none' }}
    >
      <color attach="background" args={['#bfe6fb']} />

      <ambientLight intensity={1.5} />
      <directionalLight position={[6, 10, 8]} intensity={1.5} />
      <directionalLight position={[-8, 5, -4]} intensity={0.4} />

      <Suspense fallback={null}>
        <MiniRoom />
        {avatars.map((avatar, i) => (
          <RoomAvatar3D
            key={avatar.id}
            avatar={avatar}
            phase={i * 1.7}
            bubbleY={avatar.room.z > 0 ? 2.75 : 3.35}
            isSelected={avatar.id === selectedId}
            onSelect={() => onSelect(avatar.id)}
          />
        ))}
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        minZoom={55}
        maxZoom={150}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.6}
        target={[0, 1.1, 0]}
      />
    </Canvas>
  );
}
