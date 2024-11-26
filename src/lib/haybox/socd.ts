import { SOCD_TYPE, type SocdType } from '@/lib/socd';
import * as hb from 'haybox-webserial';

export const HAYBOX_TO_SOCD = {
  [hb.SocdType.SOCD_UNSPECIFIED]: SOCD_TYPE.UNSPECIFIED,
  [hb.SocdType.SOCD_NEUTRAL]: SOCD_TYPE.NEUTRAL,
  [hb.SocdType.SOCD_2IP]: SOCD_TYPE.SECOND_INPUT,
  [hb.SocdType.SOCD_2IP_NO_REAC]: SOCD_TYPE.SECOND_INPUT_NO_REACTIVATION,
  [hb.SocdType.SOCD_DIR1_PRIORITY]: SOCD_TYPE.DIRECTION_1_PRIORITY,
  [hb.SocdType.SOCD_DIR2_PRIORITY]: SOCD_TYPE.DIRECTION_2_PRIORITY,
} as const satisfies { [key in hb.SocdType]: SocdType };

export const SOCD_TO_HAYBOX = {
  [SOCD_TYPE.UNSPECIFIED]: hb.SocdType.SOCD_UNSPECIFIED,
  [SOCD_TYPE.NEUTRAL]: hb.SocdType.SOCD_NEUTRAL,
  [SOCD_TYPE.SECOND_INPUT]: hb.SocdType.SOCD_2IP,
  [SOCD_TYPE.SECOND_INPUT_NO_REACTIVATION]: hb.SocdType.SOCD_2IP_NO_REAC,
  [SOCD_TYPE.DIRECTION_1_PRIORITY]: hb.SocdType.SOCD_DIR1_PRIORITY,
  [SOCD_TYPE.DIRECTION_2_PRIORITY]: hb.SocdType.SOCD_DIR2_PRIORITY,
} as const satisfies { [key in SocdType]: hb.SocdType };
