import { Html } from '@react-three/drei';
import type { AvatarState } from '../types/avatar';
import { useWander } from './useWander';
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
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * One avatar standing in the 3D room, with its speech bubble and nameplate rendered as
 * DOM overlays (via drei's Html) so Korean pixel text stays crisp instead of being
 * resampled by the low-resolution WebGL buffer. Wanders near its home spot when idle —
 * see useWander for why that's ref-driven instead of React state.
 */
export function RoomAvatar3D({ avatar, phase, bubbleY, isSelected, onSelect }: RoomAvatar3DProps) {
  const badge = MOOD_BADGE[avatar.mood];
  const { positionGroup, facingGroup, walkState } = useWander(
    avatar.room.x,
    avatar.room.z,
    avatar.room.rotation,
    avatar.mood === 'idle',
  );

  return (
    <group ref={positionGroup} position={[avatar.room.x, 0, avatar.room.z]}>
      {/* Flat blob shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 12]} />
        <meshBasicMaterial color="#8a6f4a" transparent opacity={0.28} />
      </mesh>

      {/* 클릭 영역 (투명 박스) */}
      <mesh
        position={[0, 1.0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1.2, 2.2, 1.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 선택 시 하이라이트 링 */}
      {isSelected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.72, 24]} />
          <meshBasicMaterial color="#ffcd4b" transparent opacity={0.85} />
        </mesh>
      )}

      <group ref={facingGroup} rotation={[0, avatar.room.rotation, 0]}>
        <group scale={1.2}>
          <VoxelAvatar palette={avatar.palette} mood={avatar.mood} phase={phase} walkStateRef={walkState} />
        </group>
      </group>

      <group rotation={[0, -avatar.room.rotation, 0]}>
        <Html position={[0, bubbleY, 0]} center distanceFactor={7} zIndexRange={[20, 0]} pointerEvents="none">
          <div className="flex flex-col items-center gap-1">
            {badge && (
              <span
                key={`${avatar.mood}-${avatar.lastInteraction}`}
                aria-hidden="true"
                className="animate-pop-badge text-xl"
              >
                {badge}
              </span>
            )}
            <div className="relative">
              <div
                className={`font-pixel-sm pixel-frame-sm w-[150px] break-keep px-2 py-1.5 text-center text-[10px] leading-snug text-cy-ink ${
                  isSelected ? 'bg-cy-yellow' : 'bg-white'
                }`}
              >
                {avatar.statusMessage}
              </div>
              <div
                className={`absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent ${
                  isSelected ? 'border-t-cy-yellow-dark' : 'border-t-cy-navy'
                }`}
              />
            </div>
          </div>
        </Html>

        <Html position={[0, -0.05, 0.4]} center distanceFactor={7} zIndexRange={[10, 0]} pointerEvents="none">
          <span
            className={`font-pixel-sm whitespace-nowrap px-1.5 py-0.5 text-[10px] font-bold text-white ${
              isSelected ? 'bg-cy-yellow-dark' : 'bg-cy-navy'
            }`}
          >
            {avatar.name}
          </span>
        </Html>
      </group>
    </group>
  );
}
