import type { ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'blue' | 'yellow' | 'pink';
}

// White text on the bright cy-blue/cy-pink fills fails WCAG AA (checked: 4.17 and 2.15
// respectively) — cy-blue-text is a darkened blue that keeps white legible, and dark ink
// text reads far better on the bright pink than white does.
const TONE_CLASSES: Record<NonNullable<PixelButtonProps['tone']>, string> = {
  blue: 'bg-cy-blue-text text-white active:bg-cy-blue-light',
  yellow: 'bg-cy-yellow text-cy-ink active:bg-cy-yellow-dark',
  pink: 'bg-cy-pink text-cy-ink active:bg-[#ff6b96]',
};

/** Chunky pixel-frame button that visibly depresses on click, matching the retro window chrome. */
export function PixelButton({ tone = 'blue', className = '', children, style, ...props }: PixelButtonProps) {
  return (
    <button
      type="button"
      className={`pixel-frame-sm flex cursor-pointer flex-col items-center justify-center gap-1 px-1 py-2.5 text-[11px] font-bold leading-tight [transition-property:transform,filter] [transition-duration:150ms] hover:brightness-110 active:translate-y-[2px] active:brightness-95 disabled:pointer-events-none disabled:opacity-50 ${TONE_CLASSES[tone]} ${className}`}
      // Skips the ~300ms tap-delay on touch devices; merged (not overwritten) if a caller passes its own style.
      style={{ touchAction: 'manipulation', ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
