import { Button, CommunicationBackendId, GameModeId, SocdType } from 'haybox-webserial';

// taken from https://github.com/JonnyHaystack/HayBox-proto/blob/df219c63c28e3fde9ec270547c45ad68fc370648/config.options#L30
// GameModeConfig.name max_length:17
// GameModeConfig.socd_pairs max_count:10
// GameModeConfig.button_remapping max_count:60
// GameModeConfig.activation_binding max_count:4
export const NAME_MAX_LEN = 17;
export const BUTTON_REMAPPING_MAX_LEN = 60;
export const SOCDS_MAX_LEN = 10;
export const ACTIVATION_BINDING_MAX_LEN = 4;

export const defaultConfig = {
  gameModeConfigs: [
    {
      modeId: GameModeId.MODE_MELEE,
      name: '',
      socdPairs: [
        {
          buttonDir1: Button.BTN_LF3,
          buttonDir2: Button.BTN_LF1,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_LF2,
          buttonDir2: Button.BTN_RF4,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_RT3,
          buttonDir2: Button.BTN_RT5,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_RT2,
          buttonDir2: Button.BTN_RT4,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
      ],
      buttonRemapping: [],
      activationBinding: [Button.BTN_LT1, Button.BTN_MB1, Button.BTN_LF4],
      customModeConfig: 0,
      keyboardModeConfig: 0,
      rgbConfig: 0,
    },
    {
      modeId: GameModeId.MODE_PROJECT_M,
      name: '',
      socdPairs: [
        {
          buttonDir1: Button.BTN_LF3,
          buttonDir2: Button.BTN_LF1,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_LF2,
          buttonDir2: Button.BTN_RF4,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_RT3,
          buttonDir2: Button.BTN_RT5,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_RT2,
          buttonDir2: Button.BTN_RT4,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
      ],
      buttonRemapping: [],
      activationBinding: [Button.BTN_LT1, Button.BTN_MB1, Button.BTN_LF3],
      customModeConfig: 0,
      keyboardModeConfig: 0,
      rgbConfig: 0,
    },
    {
      modeId: GameModeId.MODE_ULTIMATE,
      name: '',
      socdPairs: [
        {
          buttonDir1: Button.BTN_LF3,
          buttonDir2: Button.BTN_LF1,
          socdType: SocdType.SOCD_2IP,
        },
        {
          buttonDir1: Button.BTN_LF2,
          buttonDir2: Button.BTN_RF4,
          socdType: SocdType.SOCD_2IP,
        },
        {
          buttonDir1: Button.BTN_RT3,
          buttonDir2: Button.BTN_RT5,
          socdType: SocdType.SOCD_2IP,
        },
        {
          buttonDir1: Button.BTN_RT2,
          buttonDir2: Button.BTN_RT4,
          socdType: SocdType.SOCD_2IP,
        },
      ],
      buttonRemapping: [],
      activationBinding: [Button.BTN_LT1, Button.BTN_MB1, Button.BTN_LF2],
      customModeConfig: 0,
      keyboardModeConfig: 0,
      rgbConfig: 0,
    },
    {
      modeId: GameModeId.MODE_FGC,
      name: '',
      socdPairs: [
        {
          buttonDir1: Button.BTN_LF3,
          buttonDir2: Button.BTN_LF1,
          socdType: SocdType.SOCD_NEUTRAL,
        },
        {
          buttonDir1: Button.BTN_LF2,
          buttonDir2: Button.BTN_LT1,
          socdType: SocdType.SOCD_NEUTRAL,
        },
      ],
      buttonRemapping: [
        {
          physicalButton: Button.BTN_RT4,
          activates: Button.BTN_LT1,
        },
      ],
      activationBinding: [Button.BTN_LT1, Button.BTN_MB1, Button.BTN_LF1],
      customModeConfig: 0,
      keyboardModeConfig: 0,
      rgbConfig: 0,
    },
    {
      modeId: GameModeId.MODE_RIVALS_OF_AETHER,
      name: '',
      socdPairs: [
        {
          buttonDir1: Button.BTN_LF3,
          buttonDir2: Button.BTN_LF1,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_LF2,
          buttonDir2: Button.BTN_RF4,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_RT3,
          buttonDir2: Button.BTN_RT5,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
        {
          buttonDir1: Button.BTN_RT2,
          buttonDir2: Button.BTN_RT4,
          socdType: SocdType.SOCD_2IP_NO_REAC,
        },
      ],
      buttonRemapping: [],
      activationBinding: [Button.BTN_LT1, Button.BTN_MB1, Button.BTN_RF1],
      customModeConfig: 0,
      keyboardModeConfig: 0,
      rgbConfig: 0,
    },
    {
      modeId: GameModeId.MODE_KEYBOARD,
      name: '',
      socdPairs: [
        {
          buttonDir1: Button.BTN_LF3,
          buttonDir2: Button.BTN_LF1,
          socdType: SocdType.SOCD_2IP,
        },
        {
          buttonDir1: Button.BTN_LT1,
          buttonDir2: Button.BTN_RT4,
          socdType: SocdType.SOCD_2IP,
        },
      ],
      buttonRemapping: [],
      activationBinding: [Button.BTN_LT2, Button.BTN_MB1, Button.BTN_LF4],
      customModeConfig: 0,
      keyboardModeConfig: 1,
      rgbConfig: 0,
    },
  ],
  communicationBackendConfigs: [
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_XINPUT,
      defaultModeConfig: 1,
      activationBinding: [],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_DINPUT,
      defaultModeConfig: 1,
      activationBinding: [Button.BTN_RF3],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_NINTENDO_SWITCH,
      defaultModeConfig: 3,
      activationBinding: [Button.BTN_RF2],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_GAMECUBE,
      defaultModeConfig: 1,
      activationBinding: [],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_N64,
      defaultModeConfig: 1,
      activationBinding: [],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_NES,
      defaultModeConfig: 1,
      activationBinding: [Button.BTN_LT1],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_SNES,
      defaultModeConfig: 1,
      activationBinding: [Button.BTN_LT2],
      secondaryBackends: [],
    },
    {
      backendId: CommunicationBackendId.COMMS_BACKEND_CONFIGURATOR,
      defaultModeConfig: 0,
      activationBinding: [Button.BTN_RT2],
      secondaryBackends: [],
    },
  ],
  customModes: [],
  keyboardModes: [
    {
      id: 0,
      buttonsToKeycodes: [
        {
          button: Button.BTN_LF4,
          keycode: 4,
        },
        {
          button: Button.BTN_LF3,
          keycode: 5,
        },
        {
          button: Button.BTN_LF2,
          keycode: 6,
        },
        {
          button: Button.BTN_LF1,
          keycode: 7,
        },
        {
          button: Button.BTN_LT1,
          keycode: 8,
        },
        {
          button: Button.BTN_LT2,
          keycode: 9,
        },
        {
          button: Button.BTN_MB3,
          keycode: 10,
        },
        {
          button: Button.BTN_MB1,
          keycode: 11,
        },
        {
          button: Button.BTN_MB2,
          keycode: 12,
        },
        {
          button: Button.BTN_RF5,
          keycode: 13,
        },
        {
          button: Button.BTN_RF6,
          keycode: 14,
        },
        {
          button: Button.BTN_RF7,
          keycode: 15,
        },
        {
          button: Button.BTN_RF8,
          keycode: 16,
        },
        {
          button: Button.BTN_RF1,
          keycode: 17,
        },
        {
          button: Button.BTN_RF2,
          keycode: 18,
        },
        {
          button: Button.BTN_RF3,
          keycode: 19,
        },
        {
          button: Button.BTN_RF4,
          keycode: 20,
        },
        {
          button: Button.BTN_RT4,
          keycode: 21,
        },
        {
          button: Button.BTN_RT3,
          keycode: 22,
        },
        {
          button: Button.BTN_RT5,
          keycode: 23,
        },
        {
          button: Button.BTN_RT1,
          keycode: 24,
        },
        {
          button: Button.BTN_RT2,
          keycode: 25,
        },
      ],
    },
  ],
  rgbConfigs: [],
  defaultBackendConfig: 1,
  defaultUsbBackendConfig: 1,
  rgbBrightness: 0,
};
