/** A 2D matrix of palette-index numbers describing one pixel-art sprite. 0 = transparent. */
export type PixelMatrix = number[][];

/** Maps a palette index (from a PixelMatrix) to an actual color. */
export type PixelPalette = Record<number, string>;

/** Momentary reaction played after a user interaction, then reverts to "idle". */
export type Mood = 'idle' | 'eating' | 'praised' | 'working';

export type AvatarAction = 'feed' | 'praise' | 'assignTask';

/** Where an avatar stands in the 3D mini-room, in world units on the floor plane. */
export interface RoomPlacement {
  x: number;
  z: number;
  /** Y-axis rotation in radians. 0 faces +z (toward the front of the room). */
  rotation: number;
}

/** Static, unchanging definition of a team member avatar. */
export interface AvatarProfile {
  id: string;
  name: string;
  role: string;
  /** The avatar controlled from the left profile panel / action buttons. */
  isMain: boolean;
  palette: PixelPalette;
  room: RoomPlacement;
  /** Rotating flavor lines this avatar idles through when left alone. */
  idleMessages: string[];
}

/** Values that tick over time and respond to interactions. */
export interface AvatarStats {
  /** 0 = full, 100 = starving. */
  hunger: number;
  /** 0 = fresh, 100 = exhausted. */
  fatigue: number;
  /** 0 = down, 100 = joyful. */
  happiness: number;
  /** epoch ms of the last user interaction. */
  lastInteraction: number;
}

export interface AvatarRuntime extends AvatarStats {
  mood: Mood;
  statusMessage: string;
}

/** Full live state for one avatar: static profile + ticking runtime values. */
export type AvatarState = AvatarProfile & AvatarRuntime;
