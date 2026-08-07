import { CHIBI_MATRIX } from '../../data/avatars';
import type { AvatarState, Mood } from '../../types/avatar';
import { PixelSprite } from '../ui/PixelSprite';

const MOOD_BADGE: Record<Mood, string | null> = {
  idle: null,
  eating: '🍙',
  praised: '⭐',
  working: '💻',
};

const MOOD_ANIM: Record<Mood, string> = {
  idle: 'animate-float-bob',
  eating: 'animate-wiggle',
  praised: 'animate-wiggle',
  working: 'animate-wiggle',
};

interface AvatarSpriteProps {
  avatar: AvatarState;
  pixelSize?: number;
  showBadge?: boolean;
}

/** Composes the placeholder pixel sprite with a mood reaction badge + motion — the "action animation" mock. */
export function AvatarSprite({ avatar, pixelSize = 7, showBadge = true }: AvatarSpriteProps) {
  const badge = MOOD_BADGE[avatar.mood];

  return (
    <div className="relative inline-block">
      {showBadge && badge && (
        <span
          key={`${avatar.mood}-${avatar.lastInteraction}`}
          className="animate-pop-badge pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 select-none text-lg drop-shadow"
        >
          {badge}
        </span>
      )}
      <div className={MOOD_ANIM[avatar.mood]}>
        <PixelSprite matrix={CHIBI_MATRIX} palette={avatar.palette} pixelSize={pixelSize} />
      </div>
    </div>
  );
}
