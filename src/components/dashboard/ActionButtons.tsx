import { PixelButton } from '../ui/PixelButton';

interface ActionButtonsProps {
  onFeed: () => void;
  onPraise: () => void;
  onAssignTask: () => void;
}

/** The three mock interactions the user can perform on their main avatar. */
export function ActionButtons({ onFeed, onPraise, onAssignTask }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <PixelButton tone="yellow" onClick={onFeed}>
        <span className="text-base leading-none" aria-hidden="true">
          🍙
        </span>
        <span className="whitespace-nowrap">밥주기</span>
      </PixelButton>
      <PixelButton tone="pink" onClick={onPraise}>
        <span className="text-base leading-none" aria-hidden="true">
          ⭐
        </span>
        <span className="whitespace-nowrap">칭찬하기</span>
      </PixelButton>
      <PixelButton tone="blue" onClick={onAssignTask}>
        <span className="text-base leading-none" aria-hidden="true">
          💻
        </span>
        <span className="whitespace-nowrap">업무지시</span>
      </PixelButton>
    </div>
  );
}
