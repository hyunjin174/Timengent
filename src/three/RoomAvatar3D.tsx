import { Html } from '@react-three/drei';
import type { AvatarState } from '../types/avatar';
import { VoxelAvatar } from './VoxelAvatar';

const MOOD_BADGE: Record<AvatarState['mood'], string | null> = {
  idle: null,
  eating: '🍙',
  praised: '⭐',
  working: '💻',
};

interface RoomAvatar3DProps {
  avatar: AvatarState;
  phase: number;
  /** Bubbles are staggered in height so front and back rows don't overlap on screen. */
  bubbleY: number;
}

/**
 * One avatar standing in the 3D room, with its speech bubble and nameplate rendered as
 * DOM overlays (via drei's Html) so Korean pixel text stays crisp instead of being
 * resampled by the low-resolution WebGL buffer.
 */
export function RoomAvatar3D({ avatar, phase, bubbleY }: RoomAvatar3DProps) {
  const badge = MOOD_BADGE[avatar.mood];

  return (
    <group position={[avatar.room.x, 0, avatar.room.z]} rotation={[0, avatar.room.rotation, 0]}>
      {/* Flat blob shadow instead of a real shadow map — cheaper, and truer to the pixel-art look. */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 12]} />
        <meshBasicMaterial color="#8a6f4a" transparent opacity={0.28} />
      </mesh>

      <group scale={1.2}>
        <VoxelAvatar palette={avatar.palette} mood={avatar.mood} phase={phase} />
      </group>

      {/* Counter-rotate the overlays so they always face the camera, not the character. */}
      <group rotation={[0, -avatar.room.rotation, 0]}>
        <Html position={[0, bubbleY, 0]} center distanceFactor={7} zIndexRange={[20, 0]} pointerEvents="none">
          <div className="flex flex-col items-center gap-1">
            {badge && (
              <span key={`${avatar.mood}-${avatar.lastInteraction}`} className="animate-pop-badge text-xl">
                {badge}
              </span>
            )}
            {/* Speech bubble with a small tail pointing down at the character. */}
            <div className="relative">
              <div className="font-pixel-sm pixel-frame-sm w-[150px] break-keep bg-white px-2 py-1.5 text-center text-[10px] leading-snug text-cy-ink">
                {avatar.statusMessage}
              </div>
              <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-cy-navy" />
            </div>
          </div>
        </Html>

        <Html position={[0, -0.05, 0.4]} center distanceFactor={7} zIndexRange={[10, 0]} pointerEvents="none">
          <span className="font-pixel-sm whitespace-nowrap bg-cy-navy px-1.5 py-0.5 text-[10px] font-bold text-white">
            {avatar.name}
          </span>
        </Html>
      </group>
    </group>
  );
}
