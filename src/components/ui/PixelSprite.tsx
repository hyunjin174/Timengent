import { useEffect, useRef } from 'react';
import type { PixelMatrix, PixelPalette } from '../../types/avatar';

interface PixelSpriteProps {
  matrix: PixelMatrix;
  palette: PixelPalette;
  /** Displayed size of one source pixel, in CSS px. */
  pixelSize?: number;
  className?: string;
  mirror?: boolean;
}

/**
 * Draws a small color-index matrix onto a canvas at native (tiny) resolution,
 * then scales it up in CSS with `image-rendering: pixelated` so the browser
 * upscales with hard nearest-neighbor edges instead of blurring — real pixel art
 * from plain data, no bitmap assets required.
 */
export function PixelSprite({ matrix, palette, pixelSize = 7, className = '', mirror = false }: PixelSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, cols, rows);
    matrix.forEach((row, y) => {
      row.forEach((paletteIndex, x) => {
        if (paletteIndex === 0) return;
        ctx.fillStyle = palette[paletteIndex] ?? '#ff00ff';
        ctx.fillRect(x, y, 1, 1);
      });
    });
  }, [matrix, palette, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      width={cols}
      height={rows}
      className={className}
      style={{
        width: cols * pixelSize,
        height: rows * pixelSize,
        imageRendering: 'pixelated',
        transform: mirror ? 'scaleX(-1)' : undefined,
      }}
    />
  );
}
