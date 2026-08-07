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
    role: '총괄 디렉터',
    isMain: true,
    palette: CHARACTER_PALETTES.director,
    // Front of the counter (the "visitor" side), turned toward the camera so the face reads.
    room: { x: -0.5, z: 2.2, rotation: 0.74 },
    idleMessages: [
      '오늘... 새로운 숏츠 기획 구상 중 🎬',
      '오늘... 쇼핑 트렌드 리서치 하는 중 🔍',
      '오늘... 팀원들 작업 상태 체크 중 👀',
      '오늘... 커피 한 잔의 여유 ☕',
    ],
  },
  {
    id: 'planner',
    name: '기획 AI',
    role: '콘텐츠 기획',
    isMain: false,
    palette: CHARACTER_PALETTES.planner,
    // Behind the counter, angled out toward the visitor and the camera.
    room: { x: -1.9, z: -1.6, rotation: 0.5 },
    idleMessages: [
      '이번 주 인기 상품 분석 완료했어요 📊',
      '숏츠 대본 초안 작성 중... ✍️',
      '트렌드 키워드 수집하고 있어요 🔥',
      '상품 후기 분석 중이에요 💬',
    ],
  },
  {
    id: 'editor',
    name: '편집 AI',
    role: '숏츠 편집',
    isMain: false,
    palette: CHARACTER_PALETTES.editor,
    // Second staff position along the counter.
    room: { x: 1.7, z: -1.6, rotation: 1.0 },
    idleMessages: [
      '컷 편집 90% 완료했어요! 🎞️',
      '자막 스타일 다듬는 중이에요 ✂️',
      '썸네일 3종 시안 만들었어요 🖼️',
      'BGM 맞춰보는 중... 🎵',
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
    currentTask: null,
  }));
}

/** 역할별 채팅 응답 생성기 (목업) */
export function generateAgentReply(avatarId: string, userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  // 공통 키워드
  if (msg.includes('안녕') || msg.includes('하이') || msg.includes('헬로')) {
    if (avatarId === 'director') return '네, 총괄입니다. 오늘 어떤 업무를 진행할까요? 🎬';
    if (avatarId === 'planner') return '안녕하세요! 기획 AI예요. 어떤 콘텐츠 기획이 필요하신가요? ✍️';
    return '안녕하세요! 편집 AI입니다. 편집할 영상 있으신가요? 🎞️';
  }

  if (msg.includes('상태') || msg.includes('어때') || msg.includes('진행')) {
    if (avatarId === 'director') return '팀원들 작업 상태 점검 중입니다. 특이사항 있으면 바로 보고드릴게요!';
    if (avatarId === 'planner') return '현재 트렌드 분석과 대본 초안 작업을 병행하고 있어요. 곧 초안 올려드릴게요!';
    return '편집은 순조롭게 진행 중입니다. 컷 편집 거의 다 끝났어요!';
  }

  if (msg.includes('고마') || msg.includes('수고') || msg.includes('잘했')) {
    return '감사합니다! 더 열심히 할게요 💪';
  }

  // 기획 AI 전용
  if (avatarId === 'planner') {
    if (msg.includes('대본') || msg.includes('스크립트') || msg.includes('시나리오')) {
      return '네! 숏츠 대본 바로 작성할게요. 주제나 상품명 알려주시면 더 정확하게 만들 수 있어요 ✍️';
    }
    if (msg.includes('트렌드') || msg.includes('키워드') || msg.includes('인기')) {
      return '이번 주 인기 키워드 분석해서 정리해드릴게요. 잠시만 기다려주세요 📊';
    }
    if (msg.includes('상품') || msg.includes('리뷰') || msg.includes('후기')) {
      return '상품 후기와 구매 포인트 정리해서 기획안으로 만들어드릴게요!';
    }
    return `알겠습니다! "${userMessage}" 관련해서 기획안 준비해볼게요. 조금만 기다려주세요 🔥`;
  }

  // 편집 AI 전용
  if (avatarId === 'editor') {
    if (msg.includes('편집') || msg.includes('컷') || msg.includes('영상')) {
      return '네, 바로 편집 들어갈게요! 원하는 톤앤매너나 길이 있으면 말씀해주세요 🎞️';
    }
    if (msg.includes('자막') || msg.includes('텍스트')) {
      return '자막 스타일 맞춰서 넣어드릴게요. 강조하고 싶은 문구 있으신가요? ✂️';
    }
    if (msg.includes('썸네일') || msg.includes('표지')) {
      return '썸네일 시안 여러 개 만들어서 보여드릴게요 🖼️';
    }
    if (msg.includes('bgm') || msg.includes('음악') || msg.includes('사운드')) {
      return '분위기 맞는 BGM 찾아볼게요. 밝은 느낌? 아니면 긴장감 있는 느낌? 🎵';
    }
    return `네! "${userMessage}" 작업 바로 시작할게요. 완료되면 말씀드릴게요 💻`;
  }

  // 총괄 디렉터
  if (msg.includes('회의') || msg.includes('미팅') || msg.includes('브리핑')) {
    return '알겠습니다. 팀원들 모아서 간단히 브리핑 진행할게요.';
  }
  if (msg.includes('지시') || msg.includes('업무') || msg.includes('할당')) {
    return '업무 분배해서 바로 지시하겠습니다. 우선순위 있으신가요?';
  }
  return `네, 확인했습니다. "${userMessage}" 관련해서 팀 전체 조율해볼게요.`;
}
