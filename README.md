# Timengent Studio

싸이월드/다마고치 스타일의 AI 아바타 대시보드. 쇼핑 숏츠 & 콘텐츠 제작 AI 팀(총괄 디렉터, 기획 AI, 편집 AI)이 아이소메트릭 룸에 배치되어 각자 상태를 갖고 움직이는 뼈대 구현입니다.

React + TypeScript + Vite + Tailwind CSS v4.

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 타입 체크 + 프로덕션 빌드
npm run lint     # oxlint
```

## 구조

- `src/types/avatar.ts` — 아바타 상태/프로필 타입 정의
- `src/data/avatars.ts` — 팀원 목데이터 (팔레트, 배치, 대사)
- `src/hooks/useAvatarState.ts` — 배고픔/피로도/행복도 실시간 감소 로직 + 상호작용(밥주기/칭찬하기/업무지시)
- `src/components/ui/` — 재사용 픽셀 UI (PixelPanel, PixelButton, PixelSprite)
- `src/components/dashboard/` — 프로필 패널(좌) / 메인룸(우) 대시보드 컴포넌트
