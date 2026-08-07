import type { AvatarState } from '../../types/avatar';
import { PixelPanel } from '../ui/PixelPanel';
import { AvatarSprite } from './AvatarSprite';

function SignboardDecor({ className }: { className?: string }) {
  return (
    <div className={`absolute ${className ?? ''}`}>
      <div className="bg-wood-grain border-2 border-cy-wood-dark px-3 py-2 shadow-[3px_3px_0_rgba(0,0,0,0.15)]">
        <div className="border-2 border-cy-wall-trim bg-cy-wall px-3 py-1.5 text-center">
          <p className="font-pixel-sm whitespace-nowrap text-[9px] tracking-wide text-cy-wood-dark">
            SHOPPING SHORTS
          </p>
          <p className="whitespace-nowrap text-[11px] font-bold text-cy-ink">콘텐츠 스튜디오</p>
        </div>
      </div>
    </div>
  );
}

function ReceptionCounter({ className }: { className?: string }) {
  return (
    <div
      className={`bg-wood-grain absolute flex h-9 items-start justify-evenly border-2 border-cy-wood-dark px-4 pt-1 shadow-[2px_2px_0_rgba(0,0,0,0.15)] ${className ?? ''}`}
    >
      {[0, 1].map((i) => (
        <div key={i} className="h-5 w-8 border-2 border-cy-navy bg-[#3a3f4b]">
          <div className="m-0.5 h-3 w-6 bg-cy-blue-light" />
        </div>
      ))}
    </div>
  );
}

function CorkboardDecor({ className }: { className?: string }) {
  return (
    <div className={`bg-wood-grain absolute border-2 border-cy-wood-dark p-1.5 ${className ?? ''}`}>
      <div className="flex gap-1">
        <div className="h-3.5 w-3.5 -rotate-6 bg-cy-pink" />
        <div className="h-3.5 w-3.5 rotate-3 bg-cy-green" />
        <div className="h-3.5 w-3.5 -rotate-3 bg-white" />
      </div>
    </div>
  );
}

function AcUnitDecor({ className }: { className?: string }) {
  return (
    <div className={`absolute h-4 w-10 border-2 border-cy-navy bg-white ${className ?? ''}`}>
      <div className="mt-1.5 flex justify-center">
        <div className="h-0.5 w-6 bg-cy-blue-light" />
      </div>
    </div>
  );
}

function SkyWindowDecor({ className }: { className?: string }) {
  return (
    <div
      className={`from-cy-sky-top to-cy-sky-bottom absolute h-10 w-14 overflow-hidden border-2 border-cy-wood-dark bg-gradient-to-b ${className ?? ''}`}
    >
      <div className="absolute left-2 top-2 h-1.5 w-5 bg-white" />
      <div className="absolute left-3 top-[13px] h-1.5 w-3 bg-white" />
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

/** Right column: warm wood-and-cream office interior (reception counter, signboard, corkboard) with the team inside. */
export function MainRoom({ avatars }: MainRoomProps) {
  return (
    <PixelPanel className="flex w-full flex-1 flex-col">
      <div className="flex items-center justify-between bg-cy-blue px-3 py-1.5 text-[11px] font-bold text-white">
        <span>🏢 MAIN ROOM</span>
        <span>🟢 {avatars.length}명 근무 중</span>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
        <div className="bg-cy-wall absolute inset-0" />
        <div className="bg-cy-wall-trim absolute inset-x-0 bottom-[42%] h-2" />

        <AcUnitDecor className="left-[5%] top-[7%]" />
        <SkyWindowDecor className="right-[6%] top-[8%]" />
        <SignboardDecor className="left-1/2 top-[13%] -translate-x-1/2" />
        <CorkboardDecor className="bottom-[46%] left-[4%]" />

        <div className="bg-iso-floor border-cy-wood-dark absolute inset-x-0 bottom-0 h-[42%] border-t-4" />

        <ReceptionCounter className="bottom-[29%] left-[18%] w-[64%]" />
        <PlantDecor className="bottom-[6%] right-[4%]" />

        {avatars.map((avatar) => (
          <RoomAvatar key={avatar.id} avatar={avatar} />
        ))}
      </div>
    </PixelPanel>
  );
}
