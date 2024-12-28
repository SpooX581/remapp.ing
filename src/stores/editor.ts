import { BINDING, type Binding } from '@/lib/bindings';
import { PHYSICAL_BUTTON, type PhysicalButton, allPhysicalButtons } from '@/lib/buttons';
import {
  type Layout,
  type LayoutExport,
  type ModeConfig,
  type ModeConfigExport,
  exportModeConfig,
  exportPhysical,
} from '@/lib/layout';
import { GAME_MODE, type GameMode, allModes, gameModeToName } from '@/lib/modes';
import { DISPLAY_PHYSICAL_MODE, type DisplayPhysicalMode, displayPhysicalButton } from '@/lib/physicalDisplay';
import { SOCD_TYPE, SOCD_TYPE_NAME, type SocdPair, allSocdTypes } from '@/lib/socd';
import {
  BUTTON_HEIGHT,
  BUTTON_WIDTH,
  DEFAULT_VIEWPORT_HEIGHT,
  DEFAULT_VIEWPORT_WIDTH,
  MAP_SERIALIZER,
  SCALE_FACTOR,
} from '@/lib/utils';
import type { ButtonData, ButtonState } from '@/stores/profiles';
import { useLocalStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, onBeforeMount, ref, watch } from 'vue';

export type EditorButtonData = {
  mappings: Map<GameMode, Binding>;
};

const defaultModes = [GAME_MODE.MELEE, GAME_MODE.ULTIMATE];
const defaultPhysicalButtons = [PHYSICAL_BUTTON['0'], PHYSICAL_BUTTON['1']];

const _defaultButton = {
  physical: PHYSICAL_BUTTON.UNSPECIFIED,

  binding: BINDING.UNSPECIFIED,
  defaultBinding: BINDING.UNSPECIFIED,
  initialBinding: BINDING.UNSPECIFIED,
  isDirty: false,
  isHover: false,
  isModified: false,
  isSelected: false,
  socd: undefined,
};

function defaultButton() {
  return {
    ..._defaultButton,
    // avoid all buttons referencing the same map object, which would
    // cause them to share the same state
    mappings: new Map(),
  };
}

function center(width: number, height: number): [number, number] {
  return [(width / 2 - BUTTON_WIDTH / 2) / SCALE_FACTOR, (height / 2 - BUTTON_HEIGHT / 2) / SCALE_FACTOR];
}

const defaultSocdPair = {
  a: BINDING.UNSPECIFIED,
  b: BINDING.UNSPECIFIED,
  type: SOCD_TYPE.NEUTRAL,
};

const editorKey = (key: string) => `editor-${key}`;

export const useEditor = defineStore('editor', () => {
  const viewportSize = useLocalStorage<[number, number]>(editorKey('viewport-size'), [
    DEFAULT_VIEWPORT_WIDTH,
    DEFAULT_VIEWPORT_HEIGHT,
  ]);

  const layoutName = useLocalStorage<string>(editorKey('layout-name'), '');
  const deviceName = useLocalStorage<string>(editorKey('device-name'), '');
  const devicePattern = useLocalStorage<string>(editorKey('device-pattern'), '');

  const naming = useLocalStorage<DisplayPhysicalMode>(editorKey('naming'), DISPLAY_PHYSICAL_MODE.HAYBOX);

  const modes = useLocalStorage<Set<GameMode>>(editorKey('modes'), new Set(defaultModes), {
    serializer: MAP_SERIALIZER,
  });
  const modeOptions = computed(() =>
    allModes
      .filter((value) => value !== GAME_MODE.UNSPECIFIED)
      .map((value) => ({ value, label: gameModeToName(value) })),
  );

  const physicalButtons = useLocalStorage<Set<PhysicalButton>>(
    editorKey('physical-buttons'),
    new Set(defaultPhysicalButtons),
    { serializer: MAP_SERIALIZER },
  );
  const physicalButtonOptions = computed(() =>
    allPhysicalButtons
      .filter((value) => value !== PHYSICAL_BUTTON.UNSPECIFIED)
      .map((value) => ({ value, label: displayPhysicalButton(value, naming.value) })),
  );

  const virtualBindings = useLocalStorage<Map<GameMode, Map<PhysicalButton, Binding>>>(
    editorKey('virtual-bindings'),
    new Map(),
    { serializer: MAP_SERIALIZER },
  );

  // map of mode > set of keys in virtualBindings map
  const virtualButtons = computed(() => {
    return new Map(
      Array.from(virtualBindings.value.keys()).map((mode) => [
        mode,
        new Set(virtualBindings.value.get(mode)?.keys() ?? []),
      ]),
    );
  });

  const virtualButtonOptions = computed(() =>
    Array.from(allPhysicalButtons)
      .filter((button) => !physicalButtons.value.has(button) && button !== PHYSICAL_BUTTON.UNSPECIFIED)
      .map((value) => ({ value, label: displayPhysicalButton(value, naming.value) })),
  );

  function setVirtualButtons(mode: GameMode, buttons: Set<PhysicalButton>) {
    const bindings = virtualBindings.value.get(mode) ?? new Map();

    for (const button of buttons) {
      bindings.set(button, BINDING.UNSPECIFIED);
    }

    // remove bindings not in the new set
    for (const button of bindings.keys()) {
      if (!buttons.has(button)) {
        bindings.delete(button);
      }
    }

    virtualBindings.value.set(mode, bindings);
  }

  function setVirtualBinding(mode: GameMode, button: PhysicalButton, binding: Binding) {
    const bindings = virtualBindings.value.get(mode) ?? new Map();

    bindings.set(button, binding);
    virtualBindings.value.set(mode, bindings);
  }

  const viewMode = useLocalStorage<GameMode>(editorKey('view-mode'), null);
  const viewModeOptions = computed(() =>
    Array.from(modes.value.values()).map((value) => ({ value, label: gameModeToName(value) })),
  );

  watch(modes, () => {
    if ((viewMode.value == null || viewMode.value === GAME_MODE.UNSPECIFIED) && modes.value.size > 0) {
      viewMode.value = modes.value.values().next().value;
      return;
    }

    if (!modes.value.has(viewMode.value)) {
      if (modes.value.size === 0) {
        for (const button of buttons.value) {
          const binding = BINDING.UNSPECIFIED;
          button.binding = binding;
          button.defaultBinding = binding;
          button.initialBinding = binding;
        }

        viewMode.value = null;
      } else {
        viewMode.value = modes.value.values().next().value;
      }
    }
  });

  const buttons = useLocalStorage<(ButtonData & ButtonState & EditorButtonData)[]>(editorKey('buttons'), [], {
    serializer: MAP_SERIALIZER,
  });

  onBeforeMount(() => {
    buttons.value = buttons.value.map((x) => {
      return {
        ...x,
        isSelected: false,
        isHover: false,
      };
    });
  });

  const selected = ref<number | null>(null);
  const selectedButton = computed(() => (selected.value !== null ? buttons.value[selected.value] : null));

  function addButton() {
    const [x, y] = center(viewportSize.value[0], viewportSize.value[1]);
    buttons.value.push({
      i: buttons.value.length,
      x,
      y,
      ...defaultButton(),
    });
  }

  function updateButton(i: number, button: Partial<ButtonData & ButtonState>) {
    if (i < 0 || i >= buttons.value.length) return;

    buttons.value[i] = { ...buttons.value[i], ...button };
  }

  function setModeBinding(i: number, mode: GameMode, binding: Binding) {
    if (i < 0 || i >= buttons.value.length) return;

    const button = buttons.value[i];
    button.mappings.set(mode, binding);

    const b = button.mappings.get(viewMode.value) ?? BINDING.UNSPECIFIED;

    button.binding = b;
    button.defaultBinding = b;
    button.initialBinding = b;
    buttons.value[i] = { ...button };
  }

  function deleteButton(i: number) {
    if (i < 0 || i >= buttons.value.length) return;

    if (selected.value === i) {
      selected.value = null;
    }

    buttons.value.splice(i, 1);
    buttons.value = buttons.value.map((button, i) => ({ ...button, i }));
  }

  watch(
    () => viewMode.value,
    () => {
      for (const button of buttons.value) {
        const binding = button.mappings.get(viewMode.value) ?? BINDING.UNSPECIFIED;
        button.binding = binding;
        button.defaultBinding = binding;
        button.initialBinding = binding;
      }
    },
  );

  const socdPairs = useLocalStorage<Map<GameMode, SocdPair[]>>(editorKey('socd-pairs'), new Map(), {
    serializer: MAP_SERIALIZER,
  });
  const socdOptions = allSocdTypes
    .filter((type) => type !== SOCD_TYPE.UNSPECIFIED)
    .map((value) => ({ value, label: SOCD_TYPE_NAME[value] }));

  function addSocdPair(mode: GameMode) {
    const pairs = socdPairs.value.get(mode);

    if (pairs) {
      socdPairs.value.set(mode, [...pairs, { ...defaultSocdPair }]);
    } else {
      socdPairs.value.set(mode, [{ ...defaultSocdPair }]);
    }
  }

  function deleteSocdPair(mode: GameMode, i: number) {
    const pairs = socdPairs.value.get(mode);

    if (pairs) {
      socdPairs.value.set(
        mode,
        pairs.filter((_, index) => index !== i),
      );
    }
  }

  function exportToLayout(): LayoutExport {
    const layoutModes: Map<GameMode, ModeConfig> = new Map();

    for (const mode of modes.value) {
      if (!layoutModes.has(mode)) {
        const modeBindings = new Map<PhysicalButton, Binding>();

        for (const button of buttons.value) {
          const binding = button.mappings.get(mode) ?? BINDING.UNSPECIFIED;
          modeBindings.set(button.physical, binding);
        }

        const modeSocd = socdPairs.value.get(mode) ?? [];

        layoutModes.set(mode, {
          bindings: [...modeBindings],
          socd: modeSocd.map((pair) => [pair.a, pair.b, pair.type]),
        });
      }
    }

    const exportModes = Object.fromEntries([...layoutModes].map(([k, v]) => [k, exportModeConfig(v)])) as {
      [key in GameMode]: ModeConfigExport;
    };

    // add virtual buttons
    for (const [mode, bindings] of virtualBindings.value) {
      for (const [button, binding] of bindings) {
        if (!exportModes[mode]) {
          exportModes[mode] = { bindings: [], socd: [] };
        }

        if (exportModes[mode].bindings == null) {
          exportModes[mode].bindings = [];
        }

        exportModes[mode].bindings?.push([exportPhysical(button), binding, 'hidden']);
      }
    }

    const layout: LayoutExport = {
      name: layoutName.value,
      deviceName: deviceName.value || undefined,
      pattern: devicePattern.value || undefined,
      viewport: viewportSize.value,
      modes: exportModes,
      buttons: buttons.value.map((button) => [exportPhysical(button.physical), button.x, button.y]),
    };

    return layout;
  }

  function importFromLayout(layout: Layout) {
    // if you dont manually assign each index, viewportSize will either be a
    // reference to the original layout.viewport if you do something like this:
    // `viewportSize.value = layout.viewport`
    // which does insane things, or if for example you spread:
    // `viewportSize.value = [...layout.viewport]`
    // it will lose reactivity in some cases
    viewportSize.value[0] = layout.viewport[0];
    viewportSize.value[1] = layout.viewport[1];

    layoutName.value = layout.name;
    deviceName.value = layout.deviceName ?? '';
    devicePattern.value = layout.pattern?.toString() ?? '';

    const newModes = new Set(Object.keys(layout.modes).map((value) => value as GameMode));
    const newPhysicalButtons = new Set(layout.buttons.map(([button]) => button));

    const newSocdPairs = new Map<GameMode, SocdPair[]>();

    const newButtons = layout.buttons.map(([physical, x, y], i) => ({
      ...defaultButton(),
      i,
      x,
      y,
      physical,
    }));

    const newVirtualBindings = new Map<GameMode, Map<PhysicalButton, Binding>>();

    const modeConfigs = new Map(Object.entries(layout.modes).map(([key, config]) => [key as GameMode, config]));

    for (const mode of newModes) {
      const modeConfig = modeConfigs.get(mode);
      const virtual = modeConfig?.bindings.filter((b) => b.length === 3 && b[2] === 'hidden') ?? [];

      if (virtual.length > 0) {
        for (const [button, binding] of virtual) {
          if (!newVirtualBindings.has(mode)) {
            newVirtualBindings.set(mode, new Map());
          }

          newVirtualBindings.get(mode)?.set(button, binding);
        }
      }
    }

    for (const button of newButtons) {
      for (const mode of newModes) {
        const modeConfig = modeConfigs.get(mode);
        if (!modeConfig) continue;

        const bindings = new Map((modeConfig.bindings ?? []).filter((x) => x.length === 2));

        button.mappings.set(mode, bindings.get(button.physical) ?? BINDING.UNSPECIFIED);

        if (modeConfig.socd) {
          newSocdPairs.set(
            mode,
            modeConfig.socd.map(([a, b, type]) => ({ a, b, type })),
          );
        }
      }
    }

    modes.value = newModes;
    viewMode.value = Array.from(modes.value)[0];

    for (const button of newButtons) {
      const binding = button.mappings.get(viewMode.value) ?? BINDING.UNSPECIFIED;
      button.binding = binding;
      button.defaultBinding = binding;
      button.initialBinding = binding;
    }

    physicalButtons.value = newPhysicalButtons;
    virtualBindings.value = newVirtualBindings;
    buttons.value = newButtons;
    socdPairs.value = newSocdPairs;

    console.info('Imported layout:', layout);
  }

  function clear() {
    viewportSize.value = [DEFAULT_VIEWPORT_WIDTH, DEFAULT_VIEWPORT_HEIGHT];

    layoutName.value = '';
    deviceName.value = '';
    devicePattern.value = '';

    viewMode.value = null;
    naming.value = DISPLAY_PHYSICAL_MODE.HAYBOX;

    modes.value = new Set(defaultModes);
    physicalButtons.value = new Set(defaultPhysicalButtons);
    virtualBindings.value = new Map();
    buttons.value = [];
    socdPairs.value = new Map();
    selected.value = null;
  }

  return {
    viewportSize,

    layoutName,
    deviceName,
    devicePattern,
    naming,

    viewMode,
    viewModeOptions,

    modes,
    modeOptions,

    physicalButtons,
    physicalButtonOptions,

    virtualButtons,
    virtualBindings,
    virtualButtonOptions,
    setVirtualButtons,
    setVirtualBinding,

    buttons,

    selected,
    selectedButton,

    addButton,
    updateButton,
    setModeBinding,
    deleteButton,

    socdOptions,
    socdPairs,

    addSocdPair,
    deleteSocdPair,

    exportToLayout,
    importFromLayout,

    clear,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditor, import.meta.hot));
}
