<script setup lang="ts">
import Combobox from '@/components/Combobox.vue';
import BindingCombobox from '@/components/editor/BindingCombobox.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { allBindings } from '@/lib/bindings';
import { getBindingDisplayText } from '@/lib/display';
import { gameModeToName } from '@/lib/modes';
import { SOCD_TYPE_NAME } from '@/lib/socd';
import { useEditor } from '@/stores/editor';
import { Plus, X } from 'lucide-vue-next';
import { computed } from 'vue';

const editor = useEditor();

const bindingOptions = computed(() => allBindings.map((value) => ({ value, label: getBindingDisplayText(value) })));
</script>

<template>
  <div v-for="mode in editor.modes" class="flex flex-col gap-2">
    <div class="flex flex-col gap-2 rounded-lg bg-primary p-2">
      <div class="flex items-center justify-between">
        <Label class="p-2 font-semibold uppercase text-secondary">{{ gameModeToName(mode) }}</Label>
        <Button size="icon" variant="ghost" class="size-8 hover:bg-floating-hover" @click="editor.addSocdPair(mode)">
          <Plus class="size-6" />
        </Button>
      </div>

      <div
        class="relative flex flex-col gap-2 rounded-lg bg-something p-2"
        v-for="(socd, i) in editor.socdPairs.get(mode) ?? []"
      >
        <div class="absolute right-1 top-1">
          <Button
            size="icon"
            variant="ghost"
            class="flex size-5 items-center justify-center hover:bg-red-500 hover:text-white"
            @click="editor.deleteSocdPair(mode, i)"
          >
            <X class="size-4" />
          </Button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-2">
            <Label class="font-semibold uppercase text-secondary">A</Label>
            <BindingCombobox :options="bindingOptions" v-model="socd.a" close-on-select />
          </div>

          <div class="flex w-full flex-col gap-2">
            <Label class="font-semibold uppercase text-secondary">B</Label>
            <BindingCombobox :options="bindingOptions" v-model="socd.b" close-on-select />
          </div>
        </div>

        <div class="flex w-full flex-col gap-2">
          <Label class="font-semibold uppercase text-secondary">Type</Label>
          <Combobox :options="editor.socdOptions" v-model="socd.type" close-on-select>
            <template #preview="{ value }">
              <span v-if="value">{{ SOCD_TYPE_NAME[value] }}</span>
            </template>

            <template #item="{ html }"><span v-html="html" /></template>

            <template #empty>No results</template>
          </Combobox>
        </div>
      </div>
    </div>
  </div>
</template>
