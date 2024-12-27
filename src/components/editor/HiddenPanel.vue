<script setup lang="ts">
import TagSelect from '@/components/TagSelect.vue';
import BindingCombobox from '@/components/editor/BindingCombobox.vue';
import { Label } from '@/components/ui/label';
import { allBindings } from '@/lib/bindings';
import { PHYSICAL_BUTTON, type PhysicalButton } from '@/lib/buttons';
import { getBindingDisplayText } from '@/lib/display';
import { type GameMode, gameModeToName } from '@/lib/modes';
import { displayPhysicalButton } from '@/lib/physicalDisplay';
import { useEditor } from '@/stores/editor';
import { computed } from 'vue';

const editor = useEditor();

const bindingOptions = computed(() => allBindings.map((value) => ({ value, label: getBindingDisplayText(value) })));

function physicalButtonsSortFn(a: PhysicalButton, b: PhysicalButton) {
  if (a === PHYSICAL_BUTTON.UNSPECIFIED) return -1;
  if (b === PHYSICAL_BUTTON.UNSPECIFIED) return 1;
  // remaining values are integers
  return Number.parseInt(a, 10) - Number.parseInt(b, 10);
}

function getVirtualButtons(mode: GameMode) {
  return editor.virtualButtons.get(mode) ?? new Set();
}

function getVirtualBindings(mode: GameMode) {
  return editor.virtualBindings.get(mode) ?? [];
}
</script>

<template>
  <div v-for="mode in editor.modes" class="flex flex-col gap-2">
    <div class="flex flex-col p-2 px-3 rounded-lg bg-primary gap-2">
      <div class="flex flex-col">
        <Label class="py-2 text-secondary font-semibold uppercase">{{ gameModeToName(mode) }}</Label>
      </div>

      <div class="flex flex-col gap-2 py-2">
        <Label class="text-secondary font-semibold uppercase">Hidden Buttons</Label>
        <TagSelect
          :options="editor.virtualButtonOptions"
          :model-value="getVirtualButtons(mode)"
          @update:model-value="editor.setVirtualButtons(mode, $event)"
          :sort-fn="physicalButtonsSortFn"
        >
          <template #tag="{ value }">{{ displayPhysicalButton(value, editor.naming) }}</template>

          <template #item="{ html }"><span v-html="html" /></template>

          <template #empty>No results</template>
        </TagSelect>
      </div>

      <div class="flex gap-2 items-center justify-between" v-for="[button, binding] in getVirtualBindings(mode)">
        <Label class="text-secondary font-semibold uppercase">
          {{ displayPhysicalButton(button, editor.naming) }}
        </Label>
        <BindingCombobox
          class="min-w-[160px]"
          :options="bindingOptions"
          :model-value="binding"
          close-on-select
          @update:model-value="editor.setVirtualBinding(mode, button, $event)"
        />
      </div>
    </div>
  </div>
</template>
