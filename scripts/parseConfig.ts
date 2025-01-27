import {
  Config,
  Button,
  CommunicationBackendId,
  GameModeId,
  SocdType,
  AnalogTrigger,
  AnalogAxis,
  ModifierCombinationMode,
  DigitalOutput,
} from 'haybox-webserial';
import { readFileSync } from 'node:fs';

// this script is for generating the default config in `src\lib\haybox\config.ts` (used for emulated device)
// used when the default config is updated in the firmware
// give it a json file of the config dumped from serial page using getconfig command

const configPath = process.argv[2];
const data = readFileSync(configPath, 'utf8');
const config = new Config().fromJsonString(data);

const button = (b: Button) => `Button.${Button[b]}`;
const socdType = (s: SocdType) => `SocdType.${SocdType[s]}`;
const communicationBackendId = (c: CommunicationBackendId) => `CommunicationBackendId.${CommunicationBackendId[c]}`;
const gameModeId = (g: GameModeId) => `GameModeId.${GameModeId[g]}`;
const analogTrigger = (a: AnalogTrigger) => `AnalogTrigger.${AnalogTrigger[a]}`;
const analogAxis = (a: AnalogAxis) => `AnalogAxis.${AnalogAxis[a]}`;
const modifierCombinationMode = (m: ModifierCombinationMode) => `ModifierCombinationMode.${ModifierCombinationMode[m]}`;
const digitalOutput = (d: DigitalOutput) => `DigitalOutput.${DigitalOutput[d]}`;

console.info('{');

// gameModeConfigs
console.info('  gameModeConfigs: [');
for (const c of config.gameModeConfigs) {
  console.info('    {');
  console.info(`      modeId: ${gameModeId(c.modeId)},`);
  console.info(`      name: '${c.name}',`);
  console.info('      socdPairs: [');
  for (const s of c.socdPairs) {
    console.info('        {');
    console.info(`          buttonDir1: ${button(s.buttonDir1)},`);
    console.info(`          buttonDir2: ${button(s.buttonDir2)},`);
    console.info(`          socdType: ${socdType(s.socdType)},`);
    console.info('        },');
  }
  console.info('      ],');

  if (c.buttonRemapping.length > 0) {
    console.info('      buttonRemapping: [');
    for (const b of c.buttonRemapping) {
      console.info('        {');
      console.info(`          physicalButton: ${button(b.physicalButton)},`);
      console.info(`          activates: ${button(b.activates)},`);
      console.info('        },');
    }
    console.info('      ],');
  } else {
    console.info('      buttonRemapping: [],');
  }

  console.info(`      activationBinding: [${c.activationBinding.map(button).join(', ')}],`);
  console.info(`      customModeConfig: ${c.customModeConfig},`);
  console.info(`      keyboardModeConfig: ${c.keyboardModeConfig},`);
  console.info(`      rgbConfig: ${c.rgbConfig},`);
  console.info('    },');
}
console.info('  ],');

// communicationBackendConfigs
console.info('  communicationBackendConfigs: [');
for (const c of config.communicationBackendConfigs) {
  console.info('    {');
  console.info(`      backendId: ${communicationBackendId(c.backendId)},`);
  console.info(`      defaultModeConfig: ${c.defaultModeConfig},`);
  console.info(`      activationBinding: [${c.activationBinding.map(button).join(', ')}],`);
  console.info(`      secondaryBackends: [${c.secondaryBackends.map(communicationBackendId).join(', ')}],`);
  console.info('    },');
}
console.info('  ],');

// keyboardModes
console.info('  keyboardModes: [');
for (const c of config.keyboardModes) {
  console.info('    {');
  console.info(`      id: ${c.id},`);
  console.info('      buttonsToKeycodes: [');
  for (const k of c.buttonsToKeycodes) {
    console.info('        {');
    console.info(`          button: ${button(k.button)},`);
    console.info(`          keycode: ${k.keycode},`);
    console.info('        },');
  }
  console.info('      ],');
  console.info('    },');
}
console.info('  ],');

// customModes
console.info('  customModes: [');
for (const c of config.customModes) {
  console.info('    {');
  console.info(`      id: ${c.id},`);
  console.info(`      digitalButtonMappings: [${c.digitalButtonMappings.map(button).join(', ')}],`);
  console.info(`      stickDirectionMappings: [${c.stickDirectionMappings.map(button).join(', ')}],`);
  console.info('      analogTriggerMappings: [');
  for (const a of c.analogTriggerMappings) {
    console.info('        {');
    console.info(`          button: ${button(a.button)},`);
    console.info(`          trigger: ${analogTrigger(a.trigger)},`);
    console.info(`          value: ${a.value},`);
    console.info('        },');
  }
  console.info('      ],');
  console.info('      modifiers: [');
  for (const m of c.modifiers) {
    console.info('        {');
    console.info(`          buttons: [${m.buttons.map(button).join(', ')}],`);
    console.info(`          axis: ${analogAxis(m.axis)},`);
    console.info(`          multiplier: ${m.multiplier},`);
    console.info(`          combinationMode: ${modifierCombinationMode(m.combinationMode)},`);
    console.info('        },');
  }
  console.info('      ],');
  console.info(`      stickRange: ${c.stickRange},`);
  console.info('      buttonComboMappings: [');
  for (const b of c.buttonComboMappings) {
    console.info('        {');
    console.info(`          buttons: [${b.buttons.map(button).join(', ')}],`);
    console.info(`          digitalOutput: ${digitalOutput(b.digitalOutput)},`);
    console.info('        },');
  }
  console.info('      ],');
  console.info('    },');
}
console.info('  ],');

console.info(`  rgbConfigs: ${JSON.stringify(config.rgbConfigs)},`);
console.info(`  defaultBackendConfig: ${config.defaultBackendConfig},`);
console.info(`  defaultUsbBackendConfig: ${config.defaultUsbBackendConfig},`);
console.info(`  rgbBrightness: ${config.rgbBrightness},`);

console.info('}');
