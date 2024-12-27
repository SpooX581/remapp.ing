export const GAME_MODE = {
  UNSPECIFIED: 'unspecified',
  MELEE: 'melee',
  PROJECT_M: 'project_m',
  ULTIMATE: 'ultimate',
  FGC: 'fgc',
  RIVALS_OF_AETHER: 'rivals_of_aether',
  RIVALS_OF_AETHER_2: 'rivals_of_aether_2',
  KEYBOARD: 'keyboard',
  CUSTOM: 'custom',
} as const;

export type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE];

const GAME_MODE_NAME = {
  [GAME_MODE.UNSPECIFIED]: 'Unspecified',
  [GAME_MODE.MELEE]: 'Melee',
  [GAME_MODE.PROJECT_M]: 'Project M',
  [GAME_MODE.ULTIMATE]: 'Ultimate',
  [GAME_MODE.FGC]: 'FGC',
  [GAME_MODE.RIVALS_OF_AETHER]: 'Rivals',
  [GAME_MODE.RIVALS_OF_AETHER_2]: 'Rivals 2',
  [GAME_MODE.KEYBOARD]: 'Keyboard',
  [GAME_MODE.CUSTOM]: 'Custom',
} as const satisfies { [key in GameMode]: string };

export function gameModeToName(mode: GameMode): string {
  return GAME_MODE_NAME[mode] ?? `unknown ${mode}`;
}

export function gameModeToStringId(mode: GameMode): string {
  return gameModeToName(mode).replace(/ /g, '_').toLowerCase();
}

/**
 * Every possible value of `GameMode` including `unspecified`.
 */
export const allModes = Object.values(GAME_MODE) as GameMode[];
