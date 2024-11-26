import type { Binding } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import type { GameMode } from '@/lib/modes';
import type { SocdPair } from '@/lib/socd';

// todo: maybe different, taken from haybox
export const NAME_MAX_LEN = 18;
export const BUTTON_REMAPPING_MAX_LEN = 60;
export const SOCDS_MAX_LEN = 10;
export const ACTIVATION_BINDING_MAX_LEN = 4;

export type DeviceInfo = {
  deviceName: string;
  firmwareName: string;
  firmwareVersion: string;
};

export type ButtonBinding = {
  physical: PhysicalButton;
  binding: Binding;
};

export type GameModeConfig = {
  id: GameMode;
  name?: string;
  socdPairs: SocdPair[];
  buttonRemapping: ButtonBinding[];
  activationBinding: PhysicalButton[];
};

export type Config = {
  gameModes: GameModeConfig[];
  defaultMode: GameMode;
  // todo: others
};
