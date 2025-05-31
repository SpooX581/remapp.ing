import type { Binding } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import type { GameMode } from '@/lib/modes';
import type { SocdPair } from '@/lib/socd';

// todo: maybe different, taken from haybox
export const NAME_MAX_LEN = 18;
export const BUTTON_REMAPPING_MAX_LEN = 60;
export const SOCDS_MAX_LEN = 10;
export const ACTIVATION_BINDING_MAX_LEN = 4;

export const CUSTOM_AIRDODGE_MIN = 0;
export const CUSTOM_AIRDODGE_MAX = 100;

export const DEFAULT_PROJECT_M_OPTIONS: ProjectMOptions = {
  enabled: false,
  trueZPress: false,
  disableLedgedashSocdOverride: false,
  customAirdodge: null,
};

export const DEFAULT_MELEE_OPTIONS: MeleeOptions = {
  enabled: false,
  crouchWalkOs: false,
  disableLedgedashSocdOverride: false,
  customAirdodge: null,
};

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

export type Coords = {
  x: number;
  y: number;
};

export type ProjectMOptions = {
  enabled: boolean;
  trueZPress: boolean;
  disableLedgedashSocdOverride: boolean;
  customAirdodge: Coords | null;
};

export type MeleeOptions = {
  enabled: boolean;
  crouchWalkOs: boolean;
  disableLedgedashSocdOverride: boolean;
  customAirdodge: Coords | null;
};

export type Config = {
  gameModes: GameModeConfig[];
  defaultMode: GameMode;
  projectMOptions: ProjectMOptions;
  meleeOptions: MeleeOptions;
  // todo: others
};
