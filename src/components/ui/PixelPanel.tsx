import type { ReactNode } from 'react';

interface PixelPanelProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'sm';
}

/** Retro pixel-window frame: chunky stepped border + white/blue bevel, like an old OS or game dialog box. */
export function PixelPanel({ children, className = '', size = 'default' }: PixelPanelProps) {
  const frameClass = size === 'sm' ? 'pixel-frame-sm' : 'pixel-frame';
  return <div className={`${frameClass} ${className}`}>{children}</div>;
}
