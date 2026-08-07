/**
 * Palette-index meanings shared between the 2D sprite matrix and the 3D voxel avatar,
 * so one avatar definition drives both renderings.
 */
export const PART = {
  hair: 1,
  skin: 2,
  eyes: 3,
  shirt: 4,
  pants: 5,
  shoes: 6,
} as const;

/** Warm Cyworld-minihompy interior colors for the 3D room. */
export const ROOM_COLORS = {
  floor: '#e8d3ab',
  floorAlt: '#dcc296',
  wall: '#f7eeda',
  wallTrim: '#e2cfa4',
  wainscot: '#c9a271',
  wood: '#b98d5d',
  woodDark: '#8b6239',
  counter: '#c99a68',
  counterTop: '#e8cfa6',
  monitor: '#3a3f4b',
  screen: '#7cc0ee',
  white: '#ffffff',
  blue: '#3d7fc4',
  green: '#6bcf63',
  greenDark: '#4f9a3f',
  pot: '#c97b4a',
  paper: '#fdfbf2',
  pink: '#ff8fab',
  yellow: '#ffcd4b',
  sky: '#8fd0f5',
} as const;
