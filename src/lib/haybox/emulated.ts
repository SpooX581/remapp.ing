import { defaultConfig } from '@/lib/haybox/config';
import { Config, DeviceInfo, HayBoxDevice } from 'haybox-webserial';

const EMULATED_CONFIG_KEY = 'emulated-device-config';

export class EmulatedDevice extends HayBoxDevice {
  constructor() {
    // not using anything from super
    super(null as never);
  }

  getDeviceInfo(): Promise<DeviceInfo | null> {
    return Promise.resolve(
      new DeviceInfo({
        deviceName: 'GRAM Slim Smash (Emulated)',
        firmwareName: 'ChurrOS',
        firmwareVersion: '1.2.3',
      }),
    );
  }

  getConfig(): Promise<Config | null | undefined> {
    const storedConfig = localStorage.getItem(EMULATED_CONFIG_KEY);
    if (!storedConfig) return Promise.resolve(new Config(defaultConfig));
    return Promise.resolve(Config.fromJsonString(storedConfig));
  }

  setConfig(config: Config): Promise<boolean> {
    console.debug('[EmulatedDevice] Setting config:', config);
    localStorage.setItem(EMULATED_CONFIG_KEY, config.toJsonString());

    return Promise.resolve(true);
  }

  rebootBootloader(): Promise<null | undefined> {
    console.debug('[EmulatedDevice] Rebooting bootloader');

    return Promise.resolve(null);
  }

  rebootFirmware(): Promise<null | undefined> {
    console.debug('[EmulatedDevice] Rebooting firmware');

    return Promise.resolve(null);
  }
}
