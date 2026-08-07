import type { AvatarState } from '../../types/avatar';
import { PixelPanel } from '../ui/PixelPanel';
import { AvatarSprite } from './AvatarSprite';

interface AgentListProps {
  avatars: AvatarState[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** 팀원 목록 — 클릭해서 대화/업무 지시 대상 선택 */
export function AgentList({ avatars, selectedId, onSelect }: AgentListProps) {
  return (
    <PixelPanel className="w-full">
      <div className="flex items-center justify-between bg-cy-blue-text px-3 py-1.5 text-[11px] font-bold text-white">
        <h2>
          <span aria-hidden="true">👥</span> 팀원 목록
        </h2>
        <span className="text-[10px] font-normal">{avatars.length}명</span>
      </div>

      <div className="flex flex-col gap-1 bg-cy-panel-alt p-2">
        {avatars.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          const hasTask = !!avatar.currentTask;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={`flex items-center gap-2 rounded-sm border-2 px-2 py-1.5 text-left transition-colors ${
                isSelected
                  ? 'border-cy-blue bg-cy-yellow/40'
                  : 'border-transparent hover:border-cy-navy/30 hover:bg-cy-panel'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-cy-navy/30 bg-white">
                <AvatarSprite avatar={avatar} pixelSize={4} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-cy-ink">{avatar.name}</p>
                <p className="truncate text-[10px] text-cy-blue-text">
                  {hasTask ? `작업 중: ${avatar.currentTask}` : avatar.role}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                {avatar.mood === 'working' && <span className="text-[10px]">💻</span>}
                {avatar.mood === 'eating' && <span className="text-[10px]">🍙</span>}
                {avatar.mood === 'praised' && <span className="text-[10px]">⭐</span>}
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-cy-green shadow-[0_0_4px_1px_rgba(107,207,99,0.7)]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </PixelPanel>
  );
}
