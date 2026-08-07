import { useEffect, useRef, useState } from 'react';
import type { AvatarState, ChatMessage } from '../../types/avatar';
import { PixelButton } from '../ui/PixelButton';
import { PixelPanel } from '../ui/PixelPanel';

interface ChatPanelProps {
  avatar: AvatarState;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

/** 선택한 에이전트와 채팅으로 업무를 지시하는 패널 */
export function ChatPanel({ avatar, messages, onSend }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const quickCommands =
    avatar.id === 'planner'
      ? ['숏츠 대본 작성해줘', '이번 주 트렌드 분석해줘', '상품 기획안 만들어줘']
      : avatar.id === 'editor'
        ? ['영상 편집해줘', '자막 넣어줘', '썸네일 만들어줘']
        : ['팀 상태 브리핑해줘', '업무 분배해줘', '오늘 진행 상황 알려줘'];

  return (
    <PixelPanel className="flex w-full flex-col">
      <div className="flex items-center justify-between bg-cy-blue-text px-3 py-1.5 text-[11px] font-bold text-white">
        <h2>
          <span aria-hidden="true">💬</span> {avatar.name}와 대화
        </h2>
        <span className="text-[10px] font-normal opacity-90">{avatar.role}</span>
      </div>

      {/* 메시지 목록 */}
      <div
        ref={listRef}
        className="bg-grid-paper flex h-[200px] flex-col gap-2 overflow-y-auto px-3 py-2 md:h-[240px]"
      >
        {messages.length === 0 && (
          <p className="py-6 text-center text-[11px] leading-relaxed text-cy-ink/70">
            채팅으로 업무를 지시해보세요!
            <br />
            예: "숏츠 대본 작성해줘"
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] break-keep rounded-sm px-2.5 py-1.5 text-[11px] leading-snug ${
                m.from === 'user'
                  ? 'bg-cy-blue-text text-white'
                  : 'border-2 border-cy-navy bg-white text-cy-ink'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 명령어 */}
      <div className="flex flex-wrap gap-1.5 border-t-2 border-cy-navy bg-cy-cream px-2 py-2">
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => onSend(cmd)}
            className="rounded-sm border border-cy-navy/40 bg-white px-2 py-0.5 text-[10px] text-cy-ink hover:bg-cy-yellow"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* 입력창 */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t-2 border-cy-navy bg-cy-panel-alt px-2 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${avatar.name}에게 업무 지시하기...`}
          className="font-pixel flex-1 border-2 border-cy-navy bg-white px-2 py-1.5 text-[11px] text-cy-ink outline-none focus:border-cy-blue"
          maxLength={120}
        />
        <PixelButton tone="blue" type="submit" className="!px-3 !py-1.5" disabled={!input.trim()}>
          전송
        </PixelButton>
      </form>
    </PixelPanel>
  );
}
