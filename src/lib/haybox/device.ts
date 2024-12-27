import { bindingToPhysical, physicalToBinding } from '@/lib/bindings';
import type { ButtonBinding, Config, DeviceInfo, GameModeConfig } from '@/lib/config';
import { ConnectionManager, type ConnectionState } from '@/lib/device';
import { BUTTON_TO_HAYBOX, HAYBOX_TO_BUTTON } from '@/lib/haybox/buttons';
import { EmulatedDevice } from '@/lib/haybox/emulated';
import { HAYBOX_TO_MODE, MODE_TO_HAYBOX } from '@/lib/haybox/modes';
import { HAYBOX_TO_SOCD, SOCD_TO_HAYBOX } from '@/lib/haybox/socd';
import type { Layout } from '@/lib/layout';
import type { GameMode } from '@/lib/modes';
import type { SocdPair } from '@/lib/socd';
import * as hb from 'haybox-webserial';

export class SerialDeviceManager extends ConnectionManager {
  protected port: SerialPort | null = null;

  protected device: hb.HayBoxDevice | null = null;

  public getHayboxDevice(): hb.HayBoxDevice | null {
    return this.device;
  }

  /* only kept to not lose settings that arent included in the internal config */
  private config: hb.Config | null = null;

  public async connect(stateCb: (state: ConnectionState) => void): Promise<boolean> {
    if ('serial' in navigator) {
      stateCb('connecting');

      try {
        const newPort = await navigator.serial.requestPort();

        console.debug('[serial::connect] new port', newPort);

        stateCb('connected');

        this.port = newPort;
        this.device = new hb.HayBoxDevice(this.port);

        return true;
      } catch (err) {
        console.error('There was an error opening the serial port:', err);
        stateCb('disconnected');
      }
    } else {
      console.error('Web Serial API not supported.');
    }

    this.device = null;

    return false;
  }

  public async disconnect() {
    this.device = null;

    if (this.port?.connected) {
      try {
        await this.port?.close();
      } catch (err) {
        console.error('Error closing serial port:', err);
      }
    }
    this.port = null;
  }

  public async getDeviceInfo(): Promise<DeviceInfo | null> {
    if (!this.device) return null;

    const info = await this.device.getDeviceInfo();

    if (!info) return null;

    return {
      deviceName: info.deviceName,
      firmwareName: info.firmwareName,
      firmwareVersion: info.firmwareVersion,
    };
  }

  public async getConfig(layout: Layout): Promise<Config | null> {
    if (!this.device) return null;

    const config = await this.device.getConfig();

    if (!config) return null;

    this.config = config;

    const defaultBackendIdx = config.defaultBackendConfig;

    // indices are 1-based because protobuf moment
    const defaultModeIdx = config.communicationBackendConfigs[defaultBackendIdx - 1].defaultModeConfig;

    const defaultMode = config.gameModeConfigs[defaultModeIdx - 1];

    return {
      gameModes: config.gameModeConfigs.map((c) => hayboxToInternalGameMode(layout, c)),
      defaultMode: HAYBOX_TO_MODE[defaultMode.modeId],
    };
  }

  public async setConfig(layout: Layout, config: Config): Promise<boolean> {
    if (!this.device || !this.config) return false;

    this.config.gameModeConfigs = config.gameModes.map((mode) => internalGameModeToHaybox(layout, mode));

    return await this.device.setConfig(this.config);
  }
}

function hayboxToInternalSocd(layout: Layout, mode_id: hb.GameModeId, pair: hb.SocdPair): SocdPair {
  const mode = HAYBOX_TO_MODE[mode_id];
  return {
    a: physicalToBinding(layout, mode, HAYBOX_TO_BUTTON[pair.buttonDir1]),
    b: physicalToBinding(layout, mode, HAYBOX_TO_BUTTON[pair.buttonDir2]),
    type: HAYBOX_TO_SOCD[pair.socdType],
  };
}

function hayboxToInternalButtonBinding(layout: Layout, mode: hb.GameModeId, remap: hb.ButtonRemap): ButtonBinding {
  return {
    physical: HAYBOX_TO_BUTTON[remap.physicalButton],
    binding: physicalToBinding(layout, HAYBOX_TO_MODE[mode], HAYBOX_TO_BUTTON[remap.activates]),
  };
}

function hayboxToInternalGameMode(layout: Layout, config: hb.GameModeConfig): GameModeConfig {
  return {
    id: HAYBOX_TO_MODE[config.modeId],
    name: config.name,
    socdPairs: config.socdPairs.map((pair) => hayboxToInternalSocd(layout, config.modeId, pair)),
    activationBinding: config.activationBinding.map((b) => HAYBOX_TO_BUTTON[b]),
    buttonRemapping: config.buttonRemapping.map((br) => hayboxToInternalButtonBinding(layout, config.modeId, br)),
  };
}

function internalGameModeToHaybox(layout: Layout, mode: GameModeConfig): hb.GameModeConfig {
  return new hb.GameModeConfig({
    modeId: MODE_TO_HAYBOX[mode.id],
    name: mode.name,
    socdPairs: mode.socdPairs.map((pair) => internalToHayboxSocd(layout, mode.id, pair)),
    activationBinding: mode.activationBinding.map((b) => BUTTON_TO_HAYBOX[b]),
    buttonRemapping: mode.buttonRemapping.map((b) => internalToHayboxButtonBinding(layout, mode.id, b)),
  });
}

function internalToHayboxSocd(layout: Layout, mode: GameMode, pair: SocdPair): hb.SocdPair {
  return new hb.SocdPair({
    buttonDir1: BUTTON_TO_HAYBOX[bindingToPhysical(layout, mode, pair.a)],
    buttonDir2: BUTTON_TO_HAYBOX[bindingToPhysical(layout, mode, pair.b)],
    socdType: SOCD_TO_HAYBOX[pair.type],
  });
}

function internalToHayboxButtonBinding(layout: Layout, mode: GameMode, binding: ButtonBinding): hb.ButtonRemap {
  return new hb.ButtonRemap({
    physicalButton: BUTTON_TO_HAYBOX[binding.physical],
    activates: BUTTON_TO_HAYBOX[bindingToPhysical(layout, mode, binding.binding)],
  });
}

export class EmulatedSerialDeviceManager extends SerialDeviceManager {
  public connect(stateCb: (state: ConnectionState) => void): Promise<boolean> {
    this.device = new EmulatedDevice();
    stateCb('connected');
    return Promise.resolve(true);
  }
}
