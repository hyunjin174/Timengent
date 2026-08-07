import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createInitialAvatars, generateAgentReply } from '../data/avatars';
import type { AvatarAction, AvatarState, ChatMessage, Mood } from '../types/avatar';

/** How often stats tick (mocking the passage of time). Kept short so the demo is visibly alive. */
const TICK_MS = 3000;
/** How long a triggered mood (eating/praised/working) plays before reverting to idle. */
const MOOD_DURATION_MS = 2200;
/** Chance per tick that an idling avatar swaps to a new flavor line. */
const MESSAGE_SHUFFLE_CHANCE = 0.3;

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const pickRandom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const pickOtherRandom = (list: string[], current: string) => {
  if (list.length <= 1) return list[0] ?? current;
  let next = current;
  while (next === current) next = pickRandom(list);
  return next;
};

const ACTION_MESSAGES: Record<Exclude<Mood, 'idle'>, string[]> = {
  eating: ['냠냠, 든든해졌어요! 🍙', '잘 먹었습니다!', '역시 밥심이죠 😋'],
  praised: ['헤헤, 기분 최고예요! ⭐', '더 열심히 할게요!', '칭찬은 저를 춤추게 해요 💃'],
  working: ['네! 바로 작업 들어갈게요 💻', '숏츠 편집, 지금 시작합니다 🎬', '오케이, 맡겨주세요! 📋'],
};

function applyAction(avatar: AvatarState, action: AvatarAction): AvatarState {
  const mood: Mood = action === 'feed' ? 'eating' : action === 'praise' ? 'praised' : 'working';
  const delta =
    action === 'feed'
      ? { hunger: -35, fatigue: 0, happiness: 5 }
      : action === 'praise'
        ? { hunger: 0, fatigue: 0, happiness: 20 }
        : { hunger: 0, fatigue: 15, happiness: 3 };

  return {
    ...avatar,
    hunger: clamp(avatar.hunger + delta.hunger),
    fatigue: clamp(avatar.fatigue + delta.fatigue),
    happiness: clamp(avatar.happiness + delta.happiness),
    lastInteraction: Date.now(),
    mood,
    statusMessage: pickRandom(ACTION_MESSAGES[mood]),
  };
}

export function useAvatarState() {
  const [avatars, setAvatars] = useState<AvatarState[]>(createInitialAvatars);
  const [selectedId, setSelectedId] = useState<string>('director');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const moodTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const replyTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Passive decay: hunger & fatigue creep up, happiness drifts down, like a real Tamagotchi left alone.
  useEffect(() => {
    const tick = setInterval(() => {
      setAvatars((prev) =>
        prev.map((avatar) => {
          const decayed: AvatarState = {
            ...avatar,
            hunger: clamp(avatar.hunger + 1 + Math.round(Math.random())),
            fatigue: clamp(avatar.fatigue + 1 + Math.round(Math.random())),
            happiness: clamp(avatar.happiness - 1 - Math.round(Math.random())),
          };

          if (avatar.mood === 'idle' && !avatar.currentTask && Math.random() < MESSAGE_SHUFFLE_CHANCE) {
            decayed.statusMessage = pickOtherRandom(avatar.idleMessages, avatar.statusMessage);
          }

          return decayed;
        }),
      );
    }, TICK_MS);

    return () => clearInterval(tick);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(
    () => () => {
      Object.values(moodTimeouts.current).forEach(clearTimeout);
      replyTimeouts.current.forEach(clearTimeout);
    },
    [],
  );

  const performAction = useCallback((id: string, action: AvatarAction) => {
    setAvatars((prev) => prev.map((avatar) => (avatar.id === id ? applyAction(avatar, action) : avatar)));

    clearTimeout(moodTimeouts.current[id]);
    moodTimeouts.current[id] = setTimeout(() => {
      setAvatars((prev) =>
        prev.map((avatar) =>
          avatar.id === id && avatar.mood !== 'idle'
            ? { ...avatar, mood: 'idle', statusMessage: avatar.currentTask ? `작업 중: ${avatar.currentTask}` : pickRandom(avatar.idleMessages) }
            : avatar,
        ),
      );
    }, MOOD_DURATION_MS);
  }, []);

  /** 채팅으로 메시지 전송 + 에이전트 응답 */
  const sendMessage = useCallback((avatarId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = Date.now();
    const userMsg: ChatMessage = {
      id: `u-${now}`,
      avatarId,
      from: 'user',
      text: trimmed,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);

    // 업무 지시로 간주하고 상태 변경
    setAvatars((prev) =>
      prev.map((avatar) =>
        avatar.id === avatarId
          ? {
              ...avatar,
              mood: 'working' as Mood,
              currentTask: trimmed.length > 40 ? trimmed.slice(0, 40) + '…' : trimmed,
              statusMessage: '업무 지시 받았습니다! 바로 시작할게요 💻',
              lastInteraction: now,
              fatigue: clamp(avatar.fatigue + 8),
              happiness: clamp(avatar.happiness + 5),
            }
          : avatar,
      ),
    );

    // 짧은 딜레이 후 에이전트 응답 (사람처럼 보이게)
    const delay = 800 + Math.random() * 1200;
    const t = setTimeout(() => {
      const reply = generateAgentReply(avatarId, trimmed);
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        avatarId,
        from: 'agent',
        text: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMsg]);

      setAvatars((prev) =>
        prev.map((avatar) =>
          avatar.id === avatarId
            ? {
                ...avatar,
                statusMessage: reply,
              }
            : avatar,
        ),
      );

      // 잠시 후 working 무드 유지하다가 idle로 (업무는 계속 currentTask에 남김)
      clearTimeout(moodTimeouts.current[avatarId]);
      moodTimeouts.current[avatarId] = setTimeout(() => {
        setAvatars((prev) =>
          prev.map((avatar) =>
            avatar.id === avatarId && avatar.mood === 'working'
              ? {
                  ...avatar,
                  mood: 'idle',
                  statusMessage: avatar.currentTask ? `작업 중: ${avatar.currentTask}` : pickRandom(avatar.idleMessages),
                }
              : avatar,
          ),
        );
      }, 2500);
    }, delay);

    replyTimeouts.current.push(t);
  }, []);

  const selectAvatar = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const selectedAvatar = useMemo(
    () => avatars.find((a) => a.id === selectedId) ?? avatars[0],
    [avatars, selectedId],
  );

  const mainAvatar = useMemo(() => avatars.find((avatar) => avatar.isMain) ?? avatars[0], [avatars]);
  const teammates = useMemo(() => avatars.filter((avatar) => !avatar.isMain), [avatars]);

  const chatForSelected = useMemo(
    () => messages.filter((m) => m.avatarId === selectedId),
    [messages, selectedId],
  );

  return {
    avatars,
    mainAvatar,
    teammates,
    selectedAvatar,
    selectedId,
    selectAvatar,
    performAction,
    sendMessage,
    chatForSelected,
    messages,
  };
}
