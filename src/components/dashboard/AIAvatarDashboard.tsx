import { useAvatarState } from '../../hooks/useAvatarState';
import { PixelCloud } from '../ui/PixelCloud';
import { AgentList } from './AgentList';
import { ChatPanel } from './ChatPanel';
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

/** 싸이월드/다마고치 스타일 AI 아바타 대시보드 — 채팅으로 업무 지시 가능 */
export function AIAvatarDashboard() {
  const {
    avatars,
    selectedAvatar,
    selectedId,
    selectAvatar,
    performAction,
    sendMessage,
    chatForSelected,
  } = useAvatarState();

  return (
    <div className="from-cy-blue via-cy-sky-top to-cy-sky-mid min-h-screen w-full bg-gradient-to-b">
      <div className="relative h-10 overflow-hidden">
        <PixelCloud className="left-[10%] top-1" duration="80s" />
        <PixelCloud className="right-[14%] top-3" duration="110s" />
      </div>

      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 pb-6 md:px-8">
        <header className="text-center">
          <p className="text-pixel-outline text-[11px] tracking-wide text-white">
            <span aria-hidden="true">⏺</span> 팀에이전트
          </p>
          <h1 className="text-pixel-outline text-[22px] font-bold text-white">AI 아바타 스튜디오</h1>
          <p className="text-pixel-outline text-[11px] text-white">
            쇼핑 숏츠 & 콘텐츠 팀이 오늘도 열일 중이에요 · 채팅으로 업무를 지시해보세요
          </p>
        </header>

        <main className="flex flex-col items-start gap-4 lg:flex-row">
          {/* 왼쪽: 프로필 + 팀원 목록 */}
          <div className="flex w-full flex-col gap-3 lg:w-[280px]">
            <ProfilePanel
              avatar={selectedAvatar}
              onAction={(action) => performAction(selectedAvatar.id, action)}
            />
            <AgentList avatars={avatars} selectedId={selectedId} onSelect={selectAvatar} />
          </div>

          {/* 가운데: 3D 미니룸 */}
          <div className="flex w-full flex-1 flex-col gap-3">
            <MainRoom avatars={avatars} selectedId={selectedId} onSelect={selectAvatar} />
            <ChatPanel
              avatar={selectedAvatar}
              messages={chatForSelected}
              onSend={(text) => sendMessage(selectedId, text)}
            />
          </div>
        </main>
      </div>

      <div className="bg-grass-band border-cy-green-dark relative mt-6 h-16 w-full border-t-4 md:h-20">
        <div className="relative mx-auto h-full max-w-[1100px]">
          <BushCluster className="left-[8%]" />
          <BushCluster className="right-[12%]" />
        </div>
      </div>
    </div>
  );
}
