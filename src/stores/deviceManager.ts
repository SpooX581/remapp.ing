import { useToast } from '@/components/ui/toast';
import useActiveProfile from '@/composables/activeProfile';
import type { ButtonBinding, Config, DeviceInfo, GameModeConfig } from '@/lib/config';
import type { ConnectionManager, ConnectionState } from '@/lib/device';
import { EmulatedSerialDeviceManager, SerialDeviceManager } from '@/lib/haybox/device';
import { type Layout, getLayouts } from '@/lib/layout';
import type { GameMode } from '@/lib/modes';
import type { SocdPair } from '@/lib/socd';
import type { HayBoxDevice } from 'haybox-webserial';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, shallowRef, watch } from 'vue';

export const useDeviceManager = defineStore('device_manager', () => {
  const state = shallowRef<ConnectionState>('disconnected');

  const manager = shallowRef<ConnectionManager | null>(null);

  const config = shallowRef<Config | null>(null);
  const info = shallowRef<DeviceInfo | null>(null);

  const originalConfig = shallowRef<Config | null>(null);

  const layout = shallowRef<Layout | null>(null);

  const serial = shallowRef<HayBoxDevice | null>(null);

  const noLayoutFoundCallbacks: (() => void)[] = [];

  function onNoLayoutFound(callback: () => void) {
    noLayoutFoundCallbacks.push(callback);
  }

  function notifyNoLayoutFound() {
    console.debug('device::notifyNoLayoutFound');

    for (const cb of noLayoutFoundCallbacks) {
      cb();
    }
  }

  watch(state, async () => {
    if (state.value !== 'connected' || !manager.value) return;

    info.value = (await manager.value.getDeviceInfo()) ?? null;

    if (!info.value) {
      console.error('failed to get device info');
      const { toast } = useToast();
      toast({
        title: 'Failed to get device info',
        variant: 'destructive',
      });
      return;
    }

    await loadDeviceLayout(info.value.deviceName);
    if (!layout.value) {
      console.warn('no layout found for device:', info.value?.deviceName);
      notifyNoLayoutFound();
    }
  });

  watch(layout, async () => {
    if (!layout.value || !manager.value) return;

    config.value = (await manager.value.getConfig(layout.value)) ?? null;

    originalConfig.value = config.value ? config.value : null;

    console.debug('device info:', info.value);
    console.debug('device config:', config.value);
  });

  const modes = computed<Map<GameMode, GameModeConfig>>(() => {
    if (!config.value) return new Map();

    return new Map(config.value.gameModes.map((mode) => [mode.id, mode]));
  });

  async function loadDeviceLayout(name: string) {
    const layouts = await getLayouts();

    for (const [_, l] of layouts) {
      if (l.deviceName) {
        if (l.deviceName === name) {
          layout.value = l;
          break;
        }
      } else if (l.pattern?.test(name)) {
        layout.value = l;
        break;
      }
    }

    if (!layout.value) {
      const allLayouts = [...layouts.values()];
      console.warn(
        'no layout found for device:',
        `\`${name}\`,`,
        'tested:',
        allLayouts.map((l) => l.deviceName),
        allLayouts.map((l) => l.pattern),
      );
    }
  }

  function overrideLayout(newLayout: Layout) {
    layout.value = newLayout;
  }

  async function onConfigChanged() {
    if (!config.value || !info.value) return;

    const activeProfile = useActiveProfile();
    activeProfile.value = config.value.defaultMode;

    await loadDeviceLayout(info.value.deviceName);

    notifyConfigLoaded(config.value);
  }

  watch([config, info], onConfigChanged, { immediate: true });

  async function saveConfig(): Promise<boolean> {
    if (!manager.value || !config.value || !layout.value) return false;

    writeRemaps();

    if (await manager.value.setConfig(layout.value, config.value)) {
      originalConfig.value = { ...config.value };
      notifyConfigSaved();
      return true;
    }

    console.error('failed to save config');

    return false;
  }

  function clearMappings(mode: GameMode) {
    if (!config.value) return;

    const i = config.value.gameModes.findIndex((c) => c.id === mode);
    config.value.gameModes[i].buttonRemapping = [];
  }

  // #region connecting

  async function connectEmulated() {
    manager.value = new EmulatedSerialDeviceManager();
    await connectManager();
    serial.value = (manager.value as EmulatedSerialDeviceManager).getHayboxDevice();
  }

  async function connect() {
    manager.value = new SerialDeviceManager();
    await connectManager();
    serial.value = (manager.value as SerialDeviceManager).getHayboxDevice();
  }

  async function disconnect() {
    if (!manager.value) return;

    await manager.value.disconnect();

    state.value = 'disconnected';

    config.value = null;
    info.value = null;
    originalConfig.value = null;
    layout.value = null;

    serial.value = null;
    manager.value = null;

    notifyDisconnected();
  }

  async function connectManager() {
    const success = await manager.value?.connect((newState) => {
      state.value = newState;
    });

    if (success) {
      notifyConnected();
    }
  }

  const connectedCallbacks: (() => void)[] = [];

  function onConnected(callback: () => void) {
    connectedCallbacks.push(callback);
  }

  function notifyConnected() {
    console.debug('device::notifyConnected');

    for (const cb of connectedCallbacks) {
      cb();
    }
  }

  const disconnectedCallbacks: (() => void)[] = [];

  function onDisconnected(callback: () => void) {
    disconnectedCallbacks.push(callback);
  }

  function notifyDisconnected() {
    console.debug('device::notifyDisconnected');

    for (const cb of disconnectedCallbacks) {
      cb();
    }
  }

  // #endregion

  // #region config loaded

  const configLoadedCallbacks: ((config: Config) => void)[] = [];

  function onConfigLoaded(callback: (config: Config) => void) {
    configLoadedCallbacks.push(callback);
  }

  function notifyConfigLoaded(config: Config) {
    console.debug('device::notifyConfigLoaded');

    for (const cb of configLoadedCallbacks) {
      cb(config);
    }
  }

  // #endregion

  // #region config saved

  const configSavedCallbacks: (() => void)[] = [];

  function onConfigSaved(callback: () => void) {
    configSavedCallbacks.push(callback);
  }

  function notifyConfigSaved() {
    console.debug('device::notifyConfigSaved');

    for (const cb of configSavedCallbacks) {
      cb();
    }
  }

  // #endregion

  // #region remap

  type ConfigWriteCb = () => {
    mode: GameMode;
    buttons: ButtonBinding[];
    socd: SocdPair[];
  };

  const requestRemappedCallbacks: ConfigWriteCb[] = [];

  function onRequestRemapped(callback: ConfigWriteCb) {
    requestRemappedCallbacks.push(callback);
  }

  function writeRemaps() {
    if (!config.value) return;
    console.debug('device::writeRemaps');

    for (const getModifiedMappings of requestRemappedCallbacks) {
      const remapped = getModifiedMappings();

      const i = config.value.gameModes.findIndex((c) => c.id === remapped.mode);

      if (i === -1) {
        console.error('[device::writeRemaps] mode not found', remapped.mode);
        continue;
      }

      config.value.gameModes[i].buttonRemapping = remapped.buttons;
      config.value.gameModes[i].socdPairs = remapped.socd;
    }
  }

  // #endregion

  return {
    state,

    config,
    info,

    originalConfig,

    layout,
    overrideLayout,
    onNoLayoutFound,

    modes,

    clearMappings,

    connect,
    connectEmulated,
    disconnect,

    onConnected,
    onDisconnected,

    saveConfig,

    onConfigLoaded,
    onConfigSaved,
    onRequestRemapped,

    // todo: something better
    serial,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeviceManager, import.meta.hot));
}
