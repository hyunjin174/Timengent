import type { AvatarProfile, AvatarState, PixelMatrix } from '../types/avatar';

/**
 * Shared 12x14 chibi silhouette reused by every avatar. Individual characters
 * are told apart purely by palette (see CHARACTER_PALETTES below) — swap this
 * matrix out once real per-avatar sprite art / frames replace the placeholder.
 * Indices: 0 transparent, 1 hair, 2 skin, 3 eyes/mouth, 4 shirt, 5 pants, 6 shoes.
 */
export const CHIBI_MATRIX: PixelMatrix = [
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 2, 2, 2, 2, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 0, 0],
  [0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0],
  [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
  [2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2],
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
  [0, 0, 4, 4, 5, 5, 5, 5, 4, 4, 0, 0],
  [0, 0, 0, 5, 5, 0, 0, 5, 5, 0, 0, 0],
  [0, 0, 0, 6, 6, 0, 0, 6, 6, 0, 0, 0],
];

const EYE_DARK = '#2a1b10';

export const CHARACTER_PALETTES = {
  director: { 1: '#6b4423', 2: '#ffd9b3', 3: EYE_DARK, 4: '#e8543f', 5: '#2f3b52', 6: '#16314f' },
  planner: { 1: '#f2c94c', 2: '#ffe3c4', 3: EYE_DARK, 4: '#ffd166', 5: '#4d7ea8', 6: '#16314f' },
  editor: { 1: '#2b2b2b', 2: '#ffd9b3', 3: EYE_DARK, 4: '#4a90d9', 5: '#33455e', 6: '#16314f' },
} as const;

export const AVATAR_PROFILES: AvatarProfile[] = [
  {
    id: 'director',
    name: '나 (총괄 디렉터)',
    role: 'Main Director',
    isMain: true,
    palette: CHARACTER_PALETTES.director,
    room: { left: 46, bottom: 6, scale: 1.15, facing: 'right' },
    idleMessages: [
      'Today... 새로운 숏츠 기획 구상 중 🎬',
      'Today... 쇼핑 트렌드 리서치 하는 중 🔍',
      'Today... 팀원들 작업 상태 체크 중 👀',
      'Today... 커피 한 잔의 여유 ☕',
    ],
  },
  {
    id: 'planner',
    name: '기획 AI',
    role: 'Content Planner',
    isMain: false,
    palette: CHARACTER_PALETTES.planner,
    room: { left: 16, bottom: 28, scale: 0.9, facing: 'right' },
    idleMessages: [
      '이번 주 인기 상품 분석 완료했어요 📊',
      '숏츠 대본 초안 작성 중... ✍️',
      '트렌드 키워드 수집하고 있어요 🔥',
    ],
  },
  {
    id: 'editor',
    name: '편집 AI',
    role: 'Shorts Editor',
    isMain: false,
    palette: CHARACTER_PALETTES.editor,
    room: { left: 74, bottom: 20, scale: 0.95, facing: 'left' },
    idleMessages: [
      '컷 편집 90% 완료했어요! 🎞️',
      '자막 스타일 다듬는 중이에요 ✂️',
      '썸네일 3종 시안 만들었어요 🖼️',
    ],
  },
];

export function createInitialAvatars(): AvatarState[] {
  const now = Date.now();
  return AVATAR_PROFILES.map((profile) => ({
    ...profile,
    hunger: 20,
    fatigue: 15,
    happiness: 85,
    lastInteraction: now,
    mood: 'idle',
    statusMessage: profile.idleMessages[0],
  }));
}
