import type { AvatarState } from '../../types/avatar';
import { PixelPanel } from '../ui/PixelPanel';
import { AvatarSprite } from './AvatarSprite';

function PixelCloud({ className, duration }: { className?: string; duration: string }) {
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

function DeskDecor({ className }: { className?: string }) {
  return (
    <div className={`absolute flex flex-col items-center ${className ?? ''}`}>
      <div className="h-6 w-10 border-2 border-cy-navy bg-[#3a3f4b]">
        <div className="m-1 h-3 w-7 bg-cy-blue-light" />
      </div>
      <div className="h-5 w-16 border-2 border-cy-navy bg-[#a9754f]" />
      <div className="flex w-16 justify-between px-1.5">
        <div className="h-4 w-1.5 bg-[#7a5230]" />
        <div className="h-4 w-1.5 bg-[#7a5230]" />
      </div>
    </div>
  );
}

function PlantDecor({ className }: { className?: string }) {
  return (
    <div className={`absolute flex flex-col items-center ${className ?? ''}`}>
      <div className="flex items-end gap-0.5">
        <div className="h-6 w-2 bg-cy-green" />
        <div className="h-8 w-2 bg-cy-green" />
        <div className="h-6 w-2 bg-cy-green" />
      </div>
      <div className="h-4 w-6 border-2 border-cy-navy bg-[#c97b4a]" />
    </div>
  );
}

interface RoomAvatarProps {
  avatar: AvatarState;
}

function RoomAvatar({ avatar }: RoomAvatarProps) {
  return (
    <div
      className="absolute flex -translate-x-1/2 flex-col items-center"
      style={{ left: `${avatar.room.left}%`, bottom: `${avatar.room.bottom}%` }}
    >
      <div className="flex flex-col items-center" style={{ transform: `scale(${avatar.room.scale})` }}>
        <div className="font-pixel-sm pixel-frame-sm mb-1 w-[144px] break-keep bg-white/95 px-1.5 py-1 text-center text-[9px] leading-snug text-cy-ink">
          {avatar.statusMessage}
        </div>
        <AvatarSprite avatar={avatar} pixelSize={7} />
        <div className="h-1.5 w-8 bg-cy-navy/25 blur-[1px]" />
        <span className="font-pixel-sm mt-0.5 whitespace-nowrap bg-cy-navy px-1.5 py-0.5 text-[9px] font-bold text-white">
          {avatar.name}
        </span>
      </div>
    </div>
  );
}

interface MainRoomProps {
  avatars: AvatarState[];
}

/** Right column: isometric-style pixel-art office backdrop with the whole team placed inside it. */
export function MainRoom({ avatars }: MainRoomProps) {
  return (
    <PixelPanel className="flex w-full flex-1 flex-col">
      <div className="flex items-center justify-between bg-cy-blue px-3 py-1.5 text-[11px] font-bold text-white">
        <span>🏢 MAIN ROOM</span>
        <span>🟢 {avatars.length}명 근무 중</span>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
        <div className="absolute inset-0 bg-gradient-to-b from-cy-sky-top via-cy-sky-mid to-cy-sky-bottom" />
        <PixelCloud className="left-[10%] top-[10%]" duration="70s" />
        <PixelCloud className="left-[55%] top-[18%]" duration="95s" />

        <div className="bg-iso-floor absolute inset-x-0 bottom-0 h-[42%] border-t-4 border-cy-navy/40" />

        <DeskDecor className="bottom-[6%] left-[4%]" />
        <PlantDecor className="bottom-[8%] right-[4%]" />

        {avatars.map((avatar) => (
          <RoomAvatar key={avatar.id} avatar={avatar} />
        ))}
      </div>
    </PixelPanel>
  );
}
