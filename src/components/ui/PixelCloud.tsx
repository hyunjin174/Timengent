interface PixelCloudProps {
  className?: string;
  duration: string;
}

/** Blocky stacked-bar cloud silhouette, drifting slowly — the outdoor sky motif from the reference art. */
export function PixelCloud({ className, duration }: PixelCloudProps) {
  return (
    <div
      className={`absolute flex flex-col items-center gap-0.5 opacity-90 ${className ?? ''}`}
      style={{ animation: `cloud-drift ${duration} linear infinite` }}
    >
      <div className="h-2 w-8 bg-white" />
      <div className="h-2 w-14 bg-white" />
      <div className="h-2 w-10 bg-white" />
    </div>
  );
}
