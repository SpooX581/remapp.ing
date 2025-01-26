<script setup lang="ts">
import Combobox from '@/components/Combobox.vue';
import DragNumberInput from '@/components/DragNumberInput.vue';
import TagSelect from '@/components/TagSelect.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PHYSICAL_BUTTON, allPhysicalButtons } from '@/lib/buttons';
import { gameModeToName } from '@/lib/modes';
import { DISPLAY_PHYSICAL_MODE_NAME, allDisplayPhysicalModes, displayPhysicalButton } from '@/lib/physicalDisplay';
import { useEditor } from '@/stores/editor';
import { computed } from 'vue';

const editor = useEditor();

const buttonOptions = computed(() =>
  allPhysicalButtons
    .filter((button) => button !== PHYSICAL_BUTTON.UNSPECIFIED)
    .map((value) => ({ value, label: displayPhysicalButton(value, editor.naming) })),
);

const namingOptions = allDisplayPhysicalModes.map((value) => ({ value, label: DISPLAY_PHYSICAL_MODE_NAME[value] }));

function physicalButtonsSortFn(a: string, b: string) {
  if (a === PHYSICAL_BUTTON.UNSPECIFIED) return -1;
  if (b === PHYSICAL_BUTTON.UNSPECIFIED) return 1;
  // remaining values are integers
  return Number.parseInt(a, 10) - Number.parseInt(b, 10);
}

function onViewportResize(w?: string | number, h?: string | number) {
  if (w !== undefined) editor.viewportSize[0] = Number(w);
  if (h !== undefined) editor.viewportSize[1] = Number(h);
}
</script>

<template>
  <div class="mt-2 flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Viewport Size</Label>
    <div class="flex gap-2">
      <DragNumberInput
        label="W"
        :model-value="editor.viewportSize[0]"
        :min="0"
        :max="10000"
        :slow-step="1"
        :step="5"
        :fast-step="10"
        @update:model-value="(v) => onViewportResize(v, undefined)"
      />
      <DragNumberInput
        label="H"
        :model-value="editor.viewportSize[1]"
        :min="0"
        :max="10000"
        :slow-step="1"
        :step="5"
        :fast-step="10"
        @update:model-value="(v) => onViewportResize(undefined, v)"
      />
    </div>
  </div>

  <div class="mt-2 flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Layout Name</Label>
    <Input v-model="editor.layoutName" type="text" placeholder="GRAM Slim SMASH" />
  </div>

  <div class="mt-2 flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Device Name</Label>
    <Input v-model="editor.deviceName" type="text" placeholder="GRAM Slim SMASH" />
  </div>

  <div class="mt-2 flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Device Pattern</Label>
    <Input v-model="editor.devicePattern" type="text" placeholder="GRAM Slim SMASH" />
  </div>

  <div class="flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Button naming convention</Label>
    <Combobox :options="namingOptions" v-model="editor.naming" close-on-select>
      <template #preview="{ value }">
        <span v-if="value">{{ DISPLAY_PHYSICAL_MODE_NAME[value] }}</span>
      </template>

      <template #item="{ html }"><span v-html="html" /></template>

      <template #empty>No results</template>
    </Combobox>
  </div>

  <div class="flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Buttons</Label>
    <TagSelect :options="buttonOptions" v-model="editor.physicalButtons" :sort-fn="physicalButtonsSortFn">
      <template #tag="{ value }">{{ displayPhysicalButton(value, editor.naming) }}</template>

      <template #item="{ html }"><span v-html="html" /></template>

      <template #empty>No results</template>
    </TagSelect>
  </div>

  <div class="flex flex-col gap-2">
    <Label class="font-semibold uppercase text-secondary">Modes</Label>
    <TagSelect :options="editor.modeOptions" v-model="editor.modes">
      <template #tag="{ value }">{{ gameModeToName(value) }}</template>
      <template #item="{ html }"><span v-html="html" /></template>

      <template #empty>No results</template>
    </TagSelect>
  </div>
</template>
