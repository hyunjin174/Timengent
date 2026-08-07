import { useNow } from '../../hooks/useNow';
import type { AvatarAction, AvatarState } from '../../types/avatar';
import { PixelPanel } from '../ui/PixelPanel';
import { ActionButtons } from './ActionButtons';
import { AvatarSprite } from './AvatarSprite';
import { StatusGauge } from './StatusGauge';

function formatElapsed(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  if (seconds < 60) return `${seconds}초 전`;
  return `${Math.floor(seconds / 60)}분 전`;
}

interface ProfilePanelProps {
  avatar: AvatarState;
  onAction: (action: AvatarAction) => void;
}

/** 선택한 에이전트의 프로필 + 상태 + 빠른 상호작용 */
export function ProfilePanel({ avatar, onAction }: ProfilePanelProps) {
  const now = useNow(1000);

  return (
    <div className="flex w-full flex-col gap-3 md:w-[280px]">
      <PixelPanel>
        <div className="flex items-center justify-between bg-cy-blue-text px-3 py-1.5 text-[11px] font-bold text-white">
          <h2>
            <span aria-hidden="true">🏠</span> 내 스튜디오
          </h2>
          <span className="h-2 w-2 bg-cy-green shadow-[0_0_4px_2px_rgba(107,207,99,0.6)]" />
        </div>

        <div className="bg-grid-paper flex flex-col items-center gap-2 px-4 py-5">
          <div className="flex h-[132px] w-[132px] items-center justify-center border-2 border-cy-navy bg-white/70">
            <AvatarSprite avatar={avatar} pixelSize={9} />
          </div>
          <div className="text-center">
            <p className="text-pixel-shadow text-[18px] font-bold text-cy-ink">{avatar.name}</p>
            <p className="font-pixel-sm text-[9px] text-cy-blue-text">{avatar.role}</p>
          </div>
        </div>

        <div className="border-t-2 border-cy-navy bg-cy-cream px-3 py-2">
          <p aria-live="polite" className="break-keep text-[11px] leading-relaxed text-cy-ink">
            {avatar.statusMessage}
          </p>
          {avatar.currentTask && (
            <p className="mt-1 text-[10px] text-cy-blue-text">
              📋 현재 업무: {avatar.currentTask}
            </p>
          )}
          <p className="font-pixel-sm mt-1 text-right text-[9px] text-cy-ink/75">
            {formatElapsed(now - avatar.lastInteraction)} 상호작용
          </p>
        </div>
      </PixelPanel>

      <PixelPanel className="bg-cy-panel-alt px-3 py-3">
        <h2 className="mb-2 text-[11px] font-bold text-cy-blue-text">
          <span aria-hidden="true">📋</span> 상태
        </h2>
        <div className="flex flex-col gap-2">
          <StatusGauge label="배고픔" icon="🍚" value={avatar.hunger} />
          <StatusGauge label="피로도" icon="😴" value={avatar.fatigue} />
          <StatusGauge label="행복도" icon="😊" value={avatar.happiness} invert />
        </div>
      </PixelPanel>

      <PixelPanel className="bg-cy-panel-alt px-3 py-3">
        <h2 className="mb-2 text-[11px] font-bold text-cy-blue-text">
          <span aria-hidden="true">🎮</span> 빠른 상호작용
        </h2>
        <ActionButtons
          onFeed={() => onAction('feed')}
          onPraise={() => onAction('praise')}
          onAssignTask={() => onAction('assignTask')}
        />
      </PixelPanel>
    </div>
  );
}
