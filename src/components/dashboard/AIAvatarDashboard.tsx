import { useAvatarState } from '../../hooks/useAvatarState';
import { PixelCloud } from '../ui/PixelCloud';
import { MainRoom } from './MainRoom';
import { ProfilePanel } from './ProfilePanel';

function BushCluster({ className }: { className?: string }) {
  return (
    <div className={`absolute bottom-full flex items-end gap-0.5 ${className ?? ''}`}>
      <div className="bg-cy-green-dark h-3 w-3" />
      <div className="bg-cy-green-dark h-4 w-3" />
      <div className="bg-cy-green-dark h-3 w-3" />
    </div>
  );
}

/** Cyworld-minihompy-style AI avatar dashboard: profile + Tamagotchi stats on the left, team room on the right. */
export function AIAvatarDashboard() {
  const { avatars, mainAvatar, performAction } = useAvatarState();

  return (
    <div className="from-cy-blue via-cy-sky-top to-cy-sky-mid min-h-screen w-full bg-gradient-to-b">
      <div className="relative h-10 overflow-hidden">
        <PixelCloud className="left-[10%] top-1" duration="80s" />
        <PixelCloud className="right-[14%] top-3" duration="110s" />
      </div>

      <div className="mx-auto flex max-w-[1040px] flex-col gap-4 px-4 pb-6 md:px-8">
        <header className="text-center">
          {/* text-pixel-outline (not just white/opacity) keeps these legible across the
              whole sky gradient — a flat color can't clear contrast at every stop. */}
          <p className="text-pixel-outline text-[11px] tracking-wide text-white">
            <span aria-hidden="true">⏺</span> TIMENGENT
          </p>
          <h1 className="text-pixel-outline text-[22px] font-bold text-white">AI 아바타 스튜디오</h1>
          <p className="text-pixel-outline text-[11px] text-white">쇼핑 숏츠 &amp; 콘텐츠 팀이 오늘도 열일 중이에요</p>
        </header>

        <main className="flex flex-col items-start gap-4 md:flex-row">
          <ProfilePanel avatar={mainAvatar} onAction={(action) => performAction(mainAvatar.id, action)} />
          <MainRoom avatars={avatars} />
        </main>
      </div>

      <div className="bg-grass-band border-cy-green-dark relative mt-6 h-16 w-full border-t-4 md:h-20">
        <div className="relative mx-auto h-full max-w-[1040px]">
          <BushCluster className="left-[8%]" />
          <BushCluster className="right-[12%]" />
        </div>
      </div>
    </div>
  );
}
