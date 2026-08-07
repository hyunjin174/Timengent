const SEGMENTS = 10;

/** value is always "0 = worst, 100 = best" from the caller's point of view once `invert` is applied. */
function segmentColor(value: number, invert: boolean) {
  const goodness = invert ? value : 100 - value;
  if (goodness >= 66) return 'bg-cy-green';
  if (goodness >= 33) return 'bg-cy-orange';
  return 'bg-cy-red';
}

interface StatusGaugeProps {
  label: string;
  icon: string;
  value: number;
  /** Set true when a higher raw value is better (e.g. happiness), false when higher is worse (hunger, fatigue). */
  invert?: boolean;
}

/** Segmented retro HP-bar style gauge, filled left-to-right by value/10. */
export function StatusGauge({ label, icon, value, invert = false }: StatusGaugeProps) {
  const filled = Math.round((value / 100) * SEGMENTS);
  const color = segmentColor(value, invert);

  return (
    <div className="flex items-center gap-2">
      <span className="flex w-[64px] shrink-0 items-center gap-1 text-[11px] text-cy-ink">
        <span aria-hidden="true">{icon}</span>
        {label}
      </span>
      <div className="flex flex-1 gap-[2px] border-2 border-cy-navy bg-white p-[3px]">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={`h-3 flex-1 border border-cy-navy/20 ${i < filled ? color : 'bg-cy-panel'}`}
          />
        ))}
      </div>
      <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-cy-ink">{value}</span>
    </div>
  );
}
