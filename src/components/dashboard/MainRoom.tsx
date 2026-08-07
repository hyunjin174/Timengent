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
      <p className="animate-float-bob text-[11px] text-cy-ink/85">미니룸 불러오는 중...</p>
    </div>
  );
}

interface MainRoomProps {
  avatars: AvatarState[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** 오른쪽 열: 팀 전체가 사는 3D 미니룸 */
export function MainRoom({ avatars, selectedId, onSelect }: MainRoomProps) {
  return (
    <PixelPanel className="flex w-full flex-1 flex-col">
      <div className="flex items-center justify-between bg-cy-blue-text px-3 py-1.5 text-[11px] font-bold text-white">
        <h2>
          <span aria-hidden="true">🏢</span> 미니룸 3D
        </h2>
        <span>
          <span aria-hidden="true">🟢</span> {avatars.length}명 근무 중
        </span>
      </div>

      <div className="relative h-[380px] w-full md:h-[480px]">
        <Suspense fallback={<RoomLoading />}>
          <MiniRoomScene avatars={avatars} selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
        <p className="font-pixel-sm pointer-events-none absolute bottom-2 right-3 bg-white/90 px-1.5 py-0.5 text-[9px] text-cy-ink">
          드래그해서 방 돌리기 · 아바타 클릭으로 선택
        </p>
      </div>
    </PixelPanel>
  );
}
