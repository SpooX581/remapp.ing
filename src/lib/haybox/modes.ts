import { GAME_MODE, type GameMode } from '@/lib/modes';
import * as hb from 'haybox-webserial';

export const MODE_TO_HAYBOX = {
  [GAME_MODE.UNSPECIFIED]: hb.GameModeId.MODE_UNSPECIFIED,
  [GAME_MODE.MELEE]: hb.GameModeId.MODE_MELEE,
  [GAME_MODE.PROJECT_M]: hb.GameModeId.MODE_PROJECT_M,
  [GAME_MODE.ULTIMATE]: hb.GameModeId.MODE_ULTIMATE,
  [GAME_MODE.FGC]: hb.GameModeId.MODE_FGC,
  [GAME_MODE.RIVALS_OF_AETHER]: hb.GameModeId.MODE_RIVALS_OF_AETHER,
  [GAME_MODE.RIVALS_OF_AETHER_2]: hb.GameModeId.MODE_RIVALS_2,
  [GAME_MODE.KEYBOARD]: hb.GameModeId.MODE_KEYBOARD,
  [GAME_MODE.CUSTOM]: hb.GameModeId.MODE_CUSTOM,
} as const satisfies { [key in GameMode]: hb.GameModeId };

export const HAYBOX_TO_MODE = {
  [hb.GameModeId.MODE_UNSPECIFIED]: GAME_MODE.UNSPECIFIED,
  [hb.GameModeId.MODE_MELEE]: GAME_MODE.MELEE,
  [hb.GameModeId.MODE_PROJECT_M]: GAME_MODE.PROJECT_M,
  [hb.GameModeId.MODE_ULTIMATE]: GAME_MODE.ULTIMATE,
  [hb.GameModeId.MODE_FGC]: GAME_MODE.FGC,
  [hb.GameModeId.MODE_RIVALS_OF_AETHER]: GAME_MODE.RIVALS_OF_AETHER,
  [hb.GameModeId.MODE_RIVALS_2]: GAME_MODE.RIVALS_OF_AETHER_2,
  [hb.GameModeId.MODE_KEYBOARD]: GAME_MODE.KEYBOARD,
  [hb.GameModeId.MODE_CUSTOM]: GAME_MODE.CUSTOM,
} as const satisfies { [key in hb.GameModeId]: GameMode };
