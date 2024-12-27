import { BINDING, type Binding } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import { type ButtonBinding, type Config, SOCDS_MAX_LEN } from '@/lib/config';
import type { Layout } from '@/lib/layout';
import { type GameMode, gameModeToStringId } from '@/lib/modes';
import { SOCD_TYPE, type SocdPair, type SocdType } from '@/lib/socd';
import { useDeviceManager } from '@/stores/deviceManager';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type ButtonState = {
  /* currently hovered */
  isHover: boolean;
  /* currently selected */
  isSelected: boolean;
  /* modified from default mapping and not uploaded */
  isDirty: boolean;
  /* modified from default mapping */
  isModified: boolean;
};

export type ButtonData = {
  i: number;

  x: number;
  y: number;

  physical: PhysicalButton;
  defaultBinding: Binding;
  initialBinding: Binding;
  binding: Binding;

  socd?: number;
};

export type SocdPairData = {
  i: number;
} & SocdPair;

export type VirtualButton = {
  physical: PhysicalButton;
  binding: Binding;
};

function mapButton(mode: GameMode, layout: Layout, i: number): ButtonData & ButtonState {
  const [button, x, y] = layout.buttons[i];
  const binding = layout.modes[mode]?.bindings.find(([physical]) => physical === button)?.[1] || BINDING.UNSPECIFIED;

  return {
    i,
    physical: button,
    x,
    y,
    defaultBinding: binding,
    initialBinding: binding,
    binding,

    isHover: false,
    isSelected: false,
    isDirty: false,
    isModified: false,

    socd: undefined,
  };
}

function initButtons(layout: Layout, mode: GameMode): (ButtonData & ButtonState)[] {
  return new Array(layout.buttons.length).fill(0).map((_, i) => mapButton(mode, layout, i));
}

function initVirtualButtons(layout: Layout, mode: GameMode): VirtualButton[] {
  return (
    layout.modes[mode]?.bindings
      .filter(([, , visibility]) => visibility === 'hidden')
      .map(([physical, binding]) => ({ physical, binding })) || []
  );
}

export function useProfile(mode: GameMode, layout: Layout) {
  const create = defineStore(`profile_${layout.id}_${gameModeToStringId(mode)}`, () => {
    const viewportSize = ref<[number, number]>([...layout.viewport]);

    const buttons = ref<(ButtonState & ButtonData)[]>([]);
    const virtualButtons = ref<VirtualButton[]>([]);

    const socd = ref<SocdPairData[]>([]);

    const selected = ref<number | null>(null);
    const hovered = ref<number | null>(null);

    watch(selected, (newSelected, oldSelected) => {
      if (newSelected === oldSelected) return;
      if (oldSelected !== null) buttons.value[oldSelected].isSelected = false;
      if (newSelected !== null) buttons.value[newSelected].isSelected = true;
    });

    watch(hovered, (newHovered, oldHovered) => {
      if (newHovered === oldHovered) return;
      if (oldHovered !== null) buttons.value[oldHovered].isHover = false;
      if (newHovered !== null) buttons.value[newHovered].isHover = true;
    });

    function setBinding(binding: Binding) {
      if (selected.value === null) return;

      const k = buttons.value[selected.value];

      k.binding = binding;
      k.isDirty = k.initialBinding !== binding;
      k.isModified = k.defaultBinding !== binding;

      // if socd exists for new binding set k.socd
      const socdIndex = socd.value.findIndex((s) => s.a === k.binding || s.b === k.binding);
      k.socd = socdIndex === -1 ? undefined : socdIndex;
    }

    function removeBindingSocdIndex(binding: Binding) {
      buttons.value = buttons.value.map((k) => (k.binding === binding ? { ...k, socd: undefined } : k));
    }

    function setSocdBinding(i: number, side: 'a' | 'b') {
      if (selected.value === null || i < 0 || i >= socd.value.length) return;

      const selectedButton = buttons.value[selected.value];

      if (!selectedButton.binding) return;

      const selectedSocd = socd.value[i];

      if (side === 'a') {
        if (selectedSocd.a === selectedButton.binding) return;
        removeBindingSocdIndex(selectedSocd.a);
        selectedSocd.a = selectedButton.binding;
      } else {
        if (selectedSocd.b === selectedButton.binding) return;
        removeBindingSocdIndex(selectedSocd.b);
        selectedSocd.b = selectedButton.binding;
      }

      selectedButton.socd = i;
    }

    function setSocdBindingType(i: number, type: SocdType) {
      if (i < 0 || i >= socd.value.length) return;
      socd.value[i].type = type;
    }

    function addSocd() {
      if (socd.value.length >= SOCDS_MAX_LEN) return;
      const last = socd.value[socd.value.length - 1] || { i: -1 };
      socd.value.push({
        i: last.i + 1,

        a: BINDING.UNSPECIFIED,
        b: BINDING.UNSPECIFIED,
        type: SOCD_TYPE.NEUTRAL,
      });
    }

    function removeSocd(i: number) {
      if (i < 0 || i >= socd.value.length) return;
      socd.value.splice(i, 1);
      // remove socd from buttons with socd === i
      buttons.value = buttons.value.map((k) => (k.socd === i ? { ...k, socd: undefined } : k));
    }

    function onConfigSaved() {
      buttons.value = buttons.value.map((s) => ({ ...s, isDirty: false }));
    }

    function getRemappedButtons(): ButtonBinding[] {
      return buttons.value.filter((k) => k.defaultBinding !== k.binding);
    }

    function loadFromConfig(config: Config) {
      buttons.value = initButtons(layout, mode);
      virtualButtons.value = initVirtualButtons(layout, mode);

      const modeConfig = config.gameModes.find((c) => c.id === mode);
      if (!modeConfig) return;

      socd.value = modeConfig.socdPairs.map((s, i) => ({ ...s, i }));

      for (const button of buttons.value) {
        const mapping = modeConfig.buttonRemapping.find((b) => b.physical === button.physical);

        if (mapping) {
          button.binding = mapping.binding;
          button.initialBinding = button.binding;
          button.isDirty = false;
          button.isModified = button.defaultBinding !== button.binding;
        }

        const socdIndex = socd.value.findIndex((s) => s.a === button.binding || s.b === button.binding);
        button.socd = socdIndex === -1 ? undefined : socdIndex;
      }
    }

    // restore to empty state on disconnect
    function onDisconnected() {
      socd.value = [];
      buttons.value = [];
      selected.value = null;
    }

    const deviceManager = useDeviceManager();

    deviceManager.onConfigLoaded(loadFromConfig);
    deviceManager.onConfigSaved(onConfigSaved);

    deviceManager.onRequestRemapped(() => ({
      mode: mode,
      buttons: getRemappedButtons(),
      socd: socd.value.map(({ a, b, type }) => ({ a, b, type })),
    }));

    deviceManager.onDisconnected(onDisconnected);

    if (deviceManager.config) loadFromConfig(deviceManager.config);

    function clearMappings() {
      deviceManager.clearMappings(mode);
      buttons.value = buttons.value.map((k) => {
        const newSocd = socd.value.findIndex((s) => s.a === k.defaultBinding || s.b === k.defaultBinding);
        return {
          ...k,
          binding: k.defaultBinding,
          initialBinding: k.defaultBinding,
          isDirty: false,
          isModified: false,
          socd: newSocd === -1 ? undefined : newSocd,
        };
      });

      deviceManager.saveConfig();
    }

    return {
      viewportSize,

      buttons,
      virtualButtons,
      socd,
      hovered,
      selected,

      setBinding,
      setSocdBinding,
      setSocdBindingType,
      addSocd,
      removeSocd,

      clearMappings,
    };
  });

  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(create, import.meta.hot));
  }

  return create();
}
