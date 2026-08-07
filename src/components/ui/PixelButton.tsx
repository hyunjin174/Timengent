import type { ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'blue' | 'yellow' | 'pink';
}

const TONE_CLASSES: Record<NonNullable<PixelButtonProps['tone']>, string> = {
  blue: 'bg-cy-blue text-white active:bg-cy-blue-light',
  yellow: 'bg-cy-yellow text-cy-ink active:bg-cy-yellow-dark',
  pink: 'bg-cy-pink text-white active:bg-[#ff6b96]',
};

/** Chunky pixel-frame button that visibly depresses on click, matching the retro window chrome. */
export function PixelButton({ tone = 'blue', className = '', children, ...props }: PixelButtonProps) {
  return (
    <button
      type="button"
      className={`pixel-frame-sm flex cursor-pointer flex-col items-center justify-center gap-1 px-1 py-2.5 text-[11px] font-bold leading-tight transition-transform active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-50 ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
