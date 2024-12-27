<script setup lang="ts">
import Combobox from '@/components/Combobox.vue';
import DragNumberInput from '@/components/DragNumberInput.vue';
import BindingCombobox from '@/components/editor/BindingCombobox.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BINDING, type Binding, allBindings } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import { getBindingDisplayText } from '@/lib/display';
import { type GameMode, gameModeToName } from '@/lib/modes';
import { displayPhysicalButton } from '@/lib/physicalDisplay';
import { SCALE_FACTOR, VIEWPORT_SAFE_MIN_X, VIEWPORT_SAFE_MIN_Y, viewport_safe_max } from '@/lib/utils';
import { type EditorButtonData, useEditor } from '@/stores/editor';
import type { ButtonData, ButtonState } from '@/stores/profiles';
import { computed } from 'vue';

const MIN_X = VIEWPORT_SAFE_MIN_X / SCALE_FACTOR;
const MIN_Y = VIEWPORT_SAFE_MIN_Y / SCALE_FACTOR;

const editor = useEditor();

const max = computed(() => viewport_safe_max(editor.viewportSize));

const maxX = computed(() => max.value[0] / SCALE_FACTOR);
const maxY = computed(() => max.value[1] / SCALE_FACTOR);

const props = defineProps<{
  button: ButtonData & ButtonState & EditorButtonData;
}>();

function onPosChanged(x: string | number, y: string | number) {
  editor.updateButton(props.button.i, { x: Number(x), y: Number(y) });
}

function onModeChange(mode: GameMode, binding: Binding) {
  editor.setModeBinding(props.button.i, mode, binding);
}

function getSelectedBinding(mode: GameMode) {
  return props.button.mappings.get(mode) ?? BINDING.UNSPECIFIED;
}

function onPhysicalButtonChange(physical: PhysicalButton) {
  editor.updateButton(props.button.i, { physical });
}

const bindingOptions = computed(() => allBindings.map((value) => ({ value, label: getBindingDisplayText(value) })));
</script>

<template>
  <div class="flex flex-col gap-2 mt-2">
    <Label class="text-secondary font-semibold uppercase">Position</Label>
    <div class="flex gap-2">
      <DragNumberInput
        label="X"
        :model-value="button.x"
        :min="MIN_X"
        :max="maxX"
        :fast-step="10"
        @update:model-value="(v) => onPosChanged(v, button.y)"
      />
      <DragNumberInput
        label="Y"
        :model-value="button.y"
        :min="MIN_Y"
        :max="maxY"
        :fast-step="10"
        @update:model-value="(v) => onPosChanged(button.x, v)"
      />
    </div>
  </div>

  <div class="flex flex-col gap-2">
    <Label class="text-secondary font-semibold uppercase">Physical Button</Label>
    <Combobox
      :model-value="button.physical"
      @update:model-value="onPhysicalButtonChange"
      :options="editor.physicalButtonOptions"
      close-on-select
    >
      <template #preview="{ value }">
        <span v-if="value">{{ displayPhysicalButton(value, editor.naming) }}</span>
      </template>

      <template #empty><div class="text-secondary">No physical button</div></template>

      <template #item="{ html }"><span v-html="html" /></template>
    </Combobox>
  </div>

  <div class="flex flex-col gap-2">
    <Label class="text-secondary font-semibold uppercase">Default bindings</Label>
    <div class="flex flex-col gap-2">
      <div v-for="mode in editor.modes" class="pl-2 flex gap-2 items-center justify-between">
        <Label class="text-secondary font-semibold">{{ gameModeToName(mode) }}</Label>

        <BindingCombobox
          class="min-w-[160px]"
          :options="bindingOptions"
          :model-value="getSelectedBinding(mode)"
          @update:model-value="(b) => onModeChange(mode, b)"
        />
      </div>
    </div>
  </div>

  <Button class="w-full hover:bg-red-500/50" @click="editor.deleteButton(button.i)">Delete</Button>
</template>
