import { Suspense, lazy } from 'react';
import type { AvatarState } from '../../types/avatar';
import { PixelPanel } from '../ui/PixelPanel';

/** three.js is a large dependency, so the 3D room loads on its own chunk after first paint. */
const MiniRoomScene = lazy(() =>
  import('../../three/MiniRoomScene').then((m) => ({ default: m.MiniRoomScene })),
);

function RoomLoading() {
  return (
    <div className="from-cy-sky-mid to-cy-sky-bottom flex h-full w-full items-center justify-center bg-gradient-to-b">
      <p className="animate-float-bob text-[11px] text-cy-ink/60">미니룸 불러오는 중...</p>
    </div>
  );
}

interface MainRoomProps {
  avatars: AvatarState[];
}

/** Right column: the 3D Cyworld-style mini-room the whole team lives in. */
export function MainRoom({ avatars }: MainRoomProps) {
  return (
    <PixelPanel className="flex w-full flex-1 flex-col">
      <div className="flex items-center justify-between bg-cy-blue px-3 py-1.5 text-[11px] font-bold text-white">
        <span>🏢 MINI ROOM 3D</span>
        <span>🟢 {avatars.length}명 근무 중</span>
      </div>

      <div className="relative h-[440px] w-full md:h-[560px]">
        <Suspense fallback={<RoomLoading />}>
          <MiniRoomScene avatars={avatars} />
        </Suspense>
        <p className="font-pixel-sm pointer-events-none absolute bottom-2 right-3 text-[9px] text-cy-ink/50">
          드래그해서 방을 돌려보세요
        </p>
      </div>
    </PixelPanel>
  );
}
