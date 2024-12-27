import type { PhysicalButton } from '@/lib/buttons';
import { BUTTON_TO_HAYBOX, HAYBOX_BUTTON_TO_NAME } from '@/lib/haybox/buttons';

function displayPhysicalButtonHaybox(button: PhysicalButton): string {
  return HAYBOX_BUTTON_TO_NAME[BUTTON_TO_HAYBOX[button]];
}

export const DISPLAY_PHYSICAL_MODE = {
  HAYBOX: 'haybox',
  RAW: 'raw',
} as const;

export type DisplayPhysicalMode = (typeof DISPLAY_PHYSICAL_MODE)[keyof typeof DISPLAY_PHYSICAL_MODE];

export const allDisplayPhysicalModes = Object.values(DISPLAY_PHYSICAL_MODE) as DisplayPhysicalMode[];

export function displayPhysicalButton(button: PhysicalButton, mode?: DisplayPhysicalMode): string {
  switch (mode ?? DISPLAY_PHYSICAL_MODE.RAW) {
    case DISPLAY_PHYSICAL_MODE.HAYBOX:
      return displayPhysicalButtonHaybox(button);
    case DISPLAY_PHYSICAL_MODE.RAW:
      return button;
    default: {
      console.warn(`Unknown display physical mode: ${mode}`);
      return button;
    }
  }
}

export const DISPLAY_PHYSICAL_MODE_NAME = {
  [DISPLAY_PHYSICAL_MODE.HAYBOX]: 'Haybox',
  [DISPLAY_PHYSICAL_MODE.RAW]: 'Raw',
} as const satisfies { [key in DisplayPhysicalMode]: string };
