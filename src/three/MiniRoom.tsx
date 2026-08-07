import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { ROOM_COLORS as C } from './palette';

const ROOM_W = 7.5;
const ROOM_D = 6.5;
const WALL_H = 3.5;
const WAINSCOT_H = 1.0;

/** Checkerboard floor tiles, laid out as flat boxes so they catch the room lighting. */
function Floor() {
  const tiles = [];
  const tile = 1;
  for (let ix = 0; ix < ROOM_W; ix++) {
    for (let iz = 0; iz < ROOM_D; iz++) {
      const x = -ROOM_W / 2 + tile / 2 + ix;
      const z = -ROOM_D / 2 + tile / 2 + iz;
      tiles.push(
        <mesh key={`${ix}-${iz}`} position={[x, -0.05, z]}>
          <boxGeometry args={[tile * 0.97, 0.1, tile * 0.97]} />
          <meshLambertMaterial color={(ix + iz) % 2 === 0 ? C.floor : C.floorAlt} />
        </mesh>,
      );
    }
  }
  return <group>{tiles}</group>;
}

/** One wall panel with a wood wainscot strip along the bottom, Cyworld-minihompy style. */
function Wall({
  position,
  rotation,
  width,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, WALL_H / 2, 0]}>
        <boxGeometry args={[width, WALL_H, 0.2]} />
        <meshLambertMaterial color={C.wall} />
      </mesh>
      <mesh position={[0, WAINSCOT_H / 2, 0.11]}>
        <boxGeometry args={[width, WAINSCOT_H, 0.06]} />
        <meshLambertMaterial color={C.wainscot} />
      </mesh>
      <mesh position={[0, WAINSCOT_H, 0.13]}>
        <boxGeometry args={[width, 0.09, 0.09]} />
        <meshLambertMaterial color={C.woodDark} />
      </mesh>
    </group>
  );
}

/** The long reception counter the staff work behind, with a raised front lip. */
function Counter() {
  return (
    <group position={[0, 0, -0.4]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[6.4, 0.9, 1.1]} />
        <meshLambertMaterial color={C.counter} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[6.7, 0.12, 1.35]} />
        <meshLambertMaterial color={C.counterTop} />
      </mesh>
      <mesh position={[0, 0.62, 0.58]}>
        <boxGeometry args={[6.4, 0.08, 0.06]} />
        <meshLambertMaterial color={C.woodDark} />
      </mesh>
    </group>
  );
}

/** Monitor + keyboard set sitting on the counter, facing the staff side. */
function Workstation({ x }: { x: number }) {
  return (
    <group position={[x, 1.01, -0.55]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.22]} />
        <meshLambertMaterial color={C.monitor} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.24, 0.08]} />
        <meshLambertMaterial color={C.monitor} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.92, 0.58, 0.09]} />
        <meshLambertMaterial color={C.monitor} />
      </mesh>
      <mesh position={[0, 0.52, -0.06]}>
        <boxGeometry args={[0.8, 0.46, 0.02]} />
        <meshBasicMaterial color={C.screen} />
      </mesh>
      <mesh position={[0, 0.04, 0.42]}>
        <boxGeometry args={[0.5, 0.04, 0.2]} />
        <meshLambertMaterial color={C.white} />
      </mesh>
    </group>
  );
}

/** Big wall plaque behind the counter, echoing the 행정복지센터 signboard in the reference art. */
function Signboard() {
  return (
    <group position={[0.4, 2.55, -ROOM_D / 2 + 0.16]}>
      <mesh>
        <boxGeometry args={[4.0, 0.95, 0.14]} />
        <meshLambertMaterial color={C.wood} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[3.7, 0.68, 0.04]} />
        <meshLambertMaterial color={C.paper} />
      </mesh>
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <mesh key={x} position={[x, 0, 0.12]}>
          <boxGeometry args={[0.5, 0.36, 0.03]} />
          <meshLambertMaterial color={C.blue} />
        </mesh>
      ))}
    </group>
  );
}

/** Wooden banners hung from the ceiling — the layered department signs of a Korean public office. */
function CeilingBanners() {
  return (
    <group>
      {[
        { x: -2.6, z: -1.2, w: 1.9 },
        { x: -1.3, z: 0.4, w: 1.7 },
      ].map((b) => (
        <group key={`${b.x}-${b.z}`} position={[b.x, 2.9, b.z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshLambertMaterial color={C.woodDark} />
          </mesh>
          <mesh>
            <boxGeometry args={[b.w, 0.42, 0.1]} />
            <meshLambertMaterial color={C.wood} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[b.w - 0.2, 0.26, 0.03]} />
            <meshLambertMaterial color={C.paper} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Ticket-number kiosk with its lit display — the 번호표 machine from the reference scene. */
function TicketKiosk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.55, 1.1, 0.45]} />
        <meshLambertMaterial color={C.white} />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[0.62, 0.42, 0.5]} />
        <meshLambertMaterial color={C.monitor} />
      </mesh>
      <mesh position={[0, 1.22, 0.26]}>
        <boxGeometry args={[0.44, 0.26, 0.03]} />
        <meshBasicMaterial color={C.screen} />
      </mesh>
      <mesh position={[0, 0.72, 0.24]}>
        <boxGeometry args={[0.3, 0.1, 0.03]} />
        <meshLambertMaterial color={C.yellow} />
      </mesh>
    </group>
  );
}

/** Small "now serving" number sign standing on the counter. */
function CounterNumberSign({ x }: { x: number }) {
  return (
    <group position={[x, 1.07, 0.1]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.05, 0.24, 0.05]} />
        <meshLambertMaterial color={C.monitor} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[0.42, 0.26, 0.06]} />
        <meshLambertMaterial color={C.monitor} />
      </mesh>
      <mesh position={[0, 0.34, 0.04]}>
        <boxGeometry args={[0.32, 0.16, 0.02]} />
        <meshBasicMaterial color={C.pink} />
      </mesh>
    </group>
  );
}

/** Water cooler tucked against the side wall. */
function WaterCooler({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.46, 0.84, 0.42]} />
        <meshLambertMaterial color={C.white} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.34, 0.4, 0.34]} />
        <meshLambertMaterial color={C.screen} />
      </mesh>
      <mesh position={[0, 0.52, 0.22]}>
        <boxGeometry args={[0.16, 0.1, 0.05]} />
        <meshLambertMaterial color={C.blue} />
      </mesh>
    </group>
  );
}

/** Pinned notice board on the side wall. */
function NoticeBoard() {
  return (
    <group position={[-ROOM_W / 2 + 0.22, 2.4, -1.2]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[2.2, 1.25, 0.12]} />
        <meshLambertMaterial color={C.wood} />
      </mesh>
      {[
        { x: -0.65, color: C.pink },
        { x: 0, color: C.paper },
        { x: 0.65, color: C.green },
      ].map((n) => (
        <mesh key={n.x} position={[n.x, 0.02, 0.09]}>
          <boxGeometry args={[0.52, 0.78, 0.03]} />
          <meshLambertMaterial color={n.color} />
        </mesh>
      ))}
    </group>
  );
}

/** Wall-mounted air conditioner from the reference scene. */
function AirConditioner() {
  return (
    <group position={[2.85, 3.05, -ROOM_D / 2 + 0.3]}>
      <mesh>
        <boxGeometry args={[1.4, 0.5, 0.42]} />
        <meshLambertMaterial color={C.white} />
      </mesh>
      <mesh position={[0, -0.22, 0.12]}>
        <boxGeometry args={[1.3, 0.1, 0.24]} />
        <meshLambertMaterial color={C.screen} />
      </mesh>
    </group>
  );
}

/** Window looking out to a bright sky, keeping the room from feeling sealed in. */
function Window() {
  return (
    <group position={[-2.75, 1.95, -ROOM_D / 2 + 0.16]}>
      <mesh>
        <boxGeometry args={[1.5, 1.15, 0.1]} />
        <meshLambertMaterial color={C.woodDark} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[1.28, 0.93, 0.04]} />
        <meshBasicMaterial color={C.sky} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[0.07, 0.93, 0.03]} />
        <meshLambertMaterial color={C.woodDark} />
      </mesh>
    </group>
  );
}

/** Potted plant, gently swaying. */
function Plant({ position }: { position: [number, number, number] }) {
  const leaves = useRef<Group>(null);
  useFrame((state) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9) * 0.05;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.5, 0.44, 0.5]} />
        <meshLambertMaterial color={C.pot} />
      </mesh>
      <group ref={leaves} position={[0, 0.44, 0]}>
        {[
          { p: [0, 0.45, 0] as [number, number, number], s: [0.26, 0.9, 0.26] as [number, number, number] },
          { p: [-0.22, 0.34, 0.05] as [number, number, number], s: [0.2, 0.68, 0.2] as [number, number, number] },
          { p: [0.22, 0.36, -0.05] as [number, number, number], s: [0.2, 0.72, 0.2] as [number, number, number] },
        ].map((leaf, i) => (
          <mesh key={i} position={leaf.p}>
            <boxGeometry args={leaf.s} />
            <meshLambertMaterial color={i === 0 ? C.green : C.greenDark} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Waiting bench for the visitor side of the room. */
function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.9, 0.12, 0.55]} />
        <meshLambertMaterial color={C.wood} />
      </mesh>
      <mesh position={[0, 0.72, -0.24]}>
        <boxGeometry args={[1.9, 0.5, 0.1]} />
        <meshLambertMaterial color={C.wood} />
      </mesh>
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.19, 0]}>
          <boxGeometry args={[0.12, 0.38, 0.5]} />
          <meshLambertMaterial color={C.woodDark} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Korean signage text, rendered as a DOM plane transformed into 3D space. Hangul on the
 * signs is what makes the room read as a Korean 동사무소 counter rather than a generic office,
 * and DOM text stays crisp instead of being chewed up by the low-res WebGL buffer.
 */
function SignText({
  position,
  rotation = [0, 0, 0],
  children,
  color = '#16314f',
  size = 12,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  children: string;
  color?: string;
  size?: number;
}) {
  return (
    <Html transform position={position} rotation={rotation} scale={0.34} zIndexRange={[5, 0]} pointerEvents="none">
      <span
        className="whitespace-nowrap font-bold"
        style={{ color, fontSize: size, fontFamily: 'Galmuri11, monospace' }}
      >
        {children}
      </span>
    </Html>
  );
}

/** The full Cyworld-style mini-room: open-corner interior with counter, signage and props. */
export function MiniRoom() {
  const backZ = -ROOM_D / 2 + 0.25;
  const leftX = -ROOM_W / 2 + 0.25;

  return (
    <group>
      <Floor />
      <Wall position={[0, 0, -ROOM_D / 2]} rotation={[0, 0, 0]} width={ROOM_W} />
      <Wall position={[-ROOM_W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} width={ROOM_D} />

      <Signboard />
      <SignText position={[0.4, 2.55, backZ]} size={15}>
        AI 콘텐츠 스튜디오
      </SignText>

      <CeilingBanners />
      <SignText position={[-2.6, 2.9, -1.2]} rotation={[0, Math.PI / 2, 0]} size={11}>
        기획 상담
      </SignText>
      <SignText position={[-1.3, 2.9, 0.4]} rotation={[0, Math.PI / 2, 0]} size={11}>
        편집 접수
      </SignText>

      <AirConditioner />
      <Window />
      <NoticeBoard />
      <SignText position={[leftX, 3.05, -1.2]} rotation={[0, Math.PI / 2, 0]} size={10} color="#8b6239">
        공지사항
      </SignText>

      {/* Monitors sit at the ends of the counter so they never block a staff member's face. */}
      <Counter />
      <Workstation x={-3.0} />
      <Workstation x={2.9} />
      <CounterNumberSign x={-0.4} />
      <CounterNumberSign x={0.9} />

      <TicketKiosk position={[3.0, 0, 1.3]} />
      <SignText position={[3.0, 1.75, 1.3]} size={10} color="#e0a400">
        번호표
      </SignText>

      <WaterCooler position={[-3.2, 0, -2.1]} />
      <Plant position={[-3.1, 0, 2.3]} />
      <Plant position={[3.2, 0, -2.6]} />
      <Bench position={[1.5, 0, 2.7]} />
    </group>
  );
}
