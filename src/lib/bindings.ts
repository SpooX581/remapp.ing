import { PHYSICAL_BUTTON, type PhysicalButton } from '@/lib/buttons';
import type { Layout } from '@/lib/layout';
import type { GameMode } from '@/lib/modes';

export const BINDING = {
  A: 'a',
  B: 'b',
  X: 'x',
  Y: 'y',
  Z: 'z',

  LEFT_SHOULDER: 'left_shoulder',
  RIGHT_SHOULDER: 'right_shoulder',

  LEFT_TRIGGER: 'left_trigger',
  RIGHT_TRIGGER: 'right_trigger',

  START: 'start',
  SELECT: 'select',
  HOME: 'home',
  CAPTURE: 'capture',

  MX: 'mx',
  MY: 'my',

  DPAD_MOD: 'dpad_mod',
  DPAD_UP: 'dpad_up',
  DPAD_DOWN: 'dpad_down',
  DPAD_LEFT: 'dpad_left',
  DPAD_RIGHT: 'dpad_right',

  LEFT_STICK_CLICK: 'left_stick_click',

  LEFT_STICK_UP: 'left_stick_up',
  LEFT_STICK_DOWN: 'left_stick_down',
  LEFT_STICK_LEFT: 'left_stick_left',
  LEFT_STICK_RIGHT: 'left_stick_right',

  RIGHT_STICK_CLICK: 'right_stick_click',

  RIGHT_STICK_UP: 'right_stick_up',
  RIGHT_STICK_DOWN: 'right_stick_down',
  RIGHT_STICK_LEFT: 'right_stick_left',
  RIGHT_STICK_RIGHT: 'right_stick_right',

  LIGHT_SHIELD: 'light_shield',
  MEDIUM_SHIELD: 'medium_shield',

  KB_A: 'kb_a',
  KB_B: 'kb_b',
  KB_C: 'kb_c',
  KB_D: 'kb_d',
  KB_E: 'kb_e',
  KB_F: 'kb_f',
  KB_G: 'kb_g',
  KB_H: 'kb_h',
  KB_I: 'kb_i',
  KB_J: 'kb_j',
  KB_K: 'kb_k',
  KB_L: 'kb_l',
  KB_M: 'kb_m',
  KB_N: 'kb_n',
  KB_O: 'kb_o',
  KB_P: 'kb_p',
  KB_Q: 'kb_q',
  KB_R: 'kb_r',
  KB_S: 'kb_s',
  KB_T: 'kb_t',
  KB_U: 'kb_u',
  KB_V: 'kb_v',
  KB_W: 'kb_w',
  KB_X: 'kb_x',
  KB_Y: 'kb_y',
  KB_Z: 'kb_z',

  UNSPECIFIED: 'unspecified',
} as const;

export type Binding = (typeof BINDING)[keyof typeof BINDING];

export const BINDINGS = Object.values(BINDING);

export function physicalToBinding(layout: Layout, mode: GameMode, button: PhysicalButton): Binding {
  const binding = layout.modes[mode]?.bindings.find(([physical, _]) => physical === button);
  return binding?.[1] ?? BINDING.UNSPECIFIED;
}

export function bindingToPhysical(layout: Layout, mode: GameMode, button: Binding): PhysicalButton {
  const physical = layout.modes[mode]?.bindings.find(([_, binding]) => binding === button);
  return physical?.[0] ?? PHYSICAL_BUTTON.UNSPECIFIED;
}

export const allBindings: Binding[] = Object.values(BINDING);
