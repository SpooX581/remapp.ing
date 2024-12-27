import { AsteriskIcon, DownIcon, LeftIcon, RightIcon, UpIcon } from '@/components/icons';
import { BINDING as B, type Binding } from '@/lib/bindings';
import type { Component } from 'vue';

export const KIND = {
  TEXT: 'text',
  ICON: 'icon',
  TEXT_ICON: 'text_icon',
} as const;

export type TextKind = typeof KIND.TEXT;
export type IconKind = typeof KIND.ICON;
export type TextIconKind = typeof KIND.TEXT_ICON;

type M = [TextKind, string] | [IconKind, Component] | [TextIconKind, string, Component];

export const bindingDisplay: { [key in Binding]: M } = {
  [B.A]: [KIND.TEXT, 'A'],
  [B.B]: [KIND.TEXT, 'B'],
  [B.X]: [KIND.TEXT, 'X'],
  [B.Y]: [KIND.TEXT, 'Y'],
  [B.Z]: [KIND.TEXT, 'Z'],

  [B.LEFT_SHOULDER]: [KIND.TEXT, 'LB'],
  [B.RIGHT_SHOULDER]: [KIND.TEXT, 'RB'],

  [B.LEFT_TRIGGER]: [KIND.TEXT, 'LT'],
  [B.RIGHT_TRIGGER]: [KIND.TEXT, 'RT'],

  [B.START]: [KIND.TEXT, 'ST'],
  [B.SELECT]: [KIND.TEXT, 'SEL'],
  [B.HOME]: [KIND.TEXT, 'HOME'],
  [B.CAPTURE]: [KIND.TEXT, 'CAP'],

  [B.DPAD_UP]: [KIND.TEXT_ICON, 'D', UpIcon],
  [B.DPAD_DOWN]: [KIND.TEXT_ICON, 'D', DownIcon],
  [B.DPAD_LEFT]: [KIND.TEXT_ICON, 'D', LeftIcon],
  [B.DPAD_RIGHT]: [KIND.TEXT_ICON, 'D', RightIcon],
  [B.DPAD_MOD]: [KIND.TEXT_ICON, 'D', AsteriskIcon],

  [B.MX]: [KIND.TEXT, 'MX'],
  [B.MY]: [KIND.TEXT, 'MY'],

  [B.LEFT_STICK_CLICK]: [KIND.TEXT, 'L3'],

  [B.LEFT_STICK_UP]: [KIND.ICON, UpIcon],
  [B.LEFT_STICK_DOWN]: [KIND.ICON, DownIcon],
  [B.LEFT_STICK_LEFT]: [KIND.ICON, LeftIcon],
  [B.LEFT_STICK_RIGHT]: [KIND.ICON, RightIcon],

  [B.RIGHT_STICK_CLICK]: [KIND.TEXT, 'R3'],

  [B.RIGHT_STICK_UP]: [KIND.TEXT_ICON, 'C', UpIcon],
  [B.RIGHT_STICK_DOWN]: [KIND.TEXT_ICON, 'C', DownIcon],
  [B.RIGHT_STICK_LEFT]: [KIND.TEXT_ICON, 'C', LeftIcon],
  [B.RIGHT_STICK_RIGHT]: [KIND.TEXT_ICON, 'C', RightIcon],

  [B.LIGHT_SHIELD]: [KIND.TEXT, 'LS'],
  [B.MEDIUM_SHIELD]: [KIND.TEXT, 'MS'],

  [B.KB_A]: [KIND.TEXT, 'A'],
  [B.KB_B]: [KIND.TEXT, 'B'],
  [B.KB_C]: [KIND.TEXT, 'C'],
  [B.KB_D]: [KIND.TEXT, 'D'],
  [B.KB_E]: [KIND.TEXT, 'E'],
  [B.KB_F]: [KIND.TEXT, 'F'],
  [B.KB_G]: [KIND.TEXT, 'G'],
  [B.KB_H]: [KIND.TEXT, 'H'],
  [B.KB_I]: [KIND.TEXT, 'I'],
  [B.KB_J]: [KIND.TEXT, 'J'],
  [B.KB_K]: [KIND.TEXT, 'K'],
  [B.KB_L]: [KIND.TEXT, 'L'],
  [B.KB_M]: [KIND.TEXT, 'M'],
  [B.KB_N]: [KIND.TEXT, 'N'],
  [B.KB_O]: [KIND.TEXT, 'O'],
  [B.KB_P]: [KIND.TEXT, 'P'],
  [B.KB_Q]: [KIND.TEXT, 'Q'],
  [B.KB_R]: [KIND.TEXT, 'R'],
  [B.KB_S]: [KIND.TEXT, 'S'],
  [B.KB_T]: [KIND.TEXT, 'T'],
  [B.KB_U]: [KIND.TEXT, 'U'],
  [B.KB_V]: [KIND.TEXT, 'V'],
  [B.KB_W]: [KIND.TEXT, 'W'],
  [B.KB_X]: [KIND.TEXT, 'X'],
  [B.KB_Y]: [KIND.TEXT, 'Y'],
  [B.KB_Z]: [KIND.TEXT, 'Z'],

  [B.UNSPECIFIED]: [KIND.TEXT, ''],
} as const;

export type BindingDisplay =
  | {
      kind: TextKind;
      text: string;
    }
  | {
      kind: IconKind;
      icon: Component;
    }
  | {
      kind: TextIconKind;
      text: string;
      icon: Component;
    };

export function getBindingDisplay(binding: Binding): BindingDisplay {
  const value = bindingDisplay[binding];

  if (!value) {
    return { kind: KIND.TEXT, text: binding };
  }

  switch (value[0]) {
    case KIND.ICON:
      return { kind: KIND.ICON, icon: value[1] };
    case KIND.TEXT_ICON:
      return { kind: KIND.TEXT_ICON, text: value[1], icon: value[2] };
    default:
      return { kind: KIND.TEXT, text: value[1] };
  }
}

export function getBindingDisplayText(binding: Binding): string {
  const value = bindingDisplay[binding];

  if (!value) {
    return binding;
  }

  switch (value[0]) {
    case KIND.ICON:
      return '';
    case KIND.TEXT_ICON:
      return value[1];
    default:
      return value[1];
  }
}
