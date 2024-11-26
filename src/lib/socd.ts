import type { Binding } from '@/lib/bindings';

export const SOCD_TYPE = {
  UNSPECIFIED: 'unspecified',
  NEUTRAL: 'neutral',
  SECOND_INPUT: 'second_input',
  SECOND_INPUT_NO_REACTIVATION: 'second_input_no_reactivation',
  DIRECTION_1_PRIORITY: 'direction_1_priority',
  DIRECTION_2_PRIORITY: 'direction_2_priority',
} as const;

export type SocdType = (typeof SOCD_TYPE)[keyof typeof SOCD_TYPE];

export type SocdPair = {
  a: Binding;
  b: Binding;
  type: SocdType;
};

export const SOCD_TYPE_NAME = {
  [SOCD_TYPE.UNSPECIFIED]: 'Unspecified',
  [SOCD_TYPE.NEUTRAL]: 'Neutral',
  [SOCD_TYPE.SECOND_INPUT]: 'Second Input',
  [SOCD_TYPE.SECOND_INPUT_NO_REACTIVATION]: 'Second Input (No Reactivation)',
  [SOCD_TYPE.DIRECTION_1_PRIORITY]: 'Direction 1 Priority',
  [SOCD_TYPE.DIRECTION_2_PRIORITY]: 'Direction 2 Priority',
} as const satisfies { [key in SocdType]: string };
