import { useAvatarState } from '../../hooks/useAvatarState';
import { MainRoom } from './MainRoom';
import { ProfilePanel } from './ProfilePanel';

/** Cyworld-minihompy-style AI avatar dashboard: profile + Tamagotchi stats on the left, team room on the right. */
export function AIAvatarDashboard() {
  const { avatars, mainAvatar, performAction } = useAvatarState();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cy-blue via-cy-sky-top to-cy-sky-mid px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-[1040px] flex-col gap-4">
        <header className="text-center">
          <p className="text-pixel-shadow text-[11px] tracking-wide text-white/90">⏺ TIMENGENT</p>
          <h1 className="text-pixel-shadow text-[22px] font-bold text-white">AI 아바타 스튜디오</h1>
          <p className="text-[11px] text-white/80">쇼핑 숏츠 &amp; 콘텐츠 팀이 오늘도 열일 중이에요</p>
        </header>

        <main className="flex flex-col items-start gap-4 md:flex-row">
          <ProfilePanel avatar={mainAvatar} onAction={(action) => performAction(mainAvatar.id, action)} />
          <MainRoom avatars={avatars} />
        </main>
      </div>
    </div>
  );
}
