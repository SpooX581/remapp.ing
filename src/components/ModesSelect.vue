<script setup lang="ts">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import { GAME_MODE, gameModeToName, type GameMode } from '@/lib/modes';
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue';
import { computed, ref } from 'vue';

type Mode = { id: GameMode; label: string };

const allModes: Mode[] = Object.values(GAME_MODE)
  .filter((id) => id !== GAME_MODE.UNSPECIFIED)
  .map((id) => ({ id, label: gameModeToName(id) }));

const modelValue = ref<Mode[]>([]);
const open = ref(false);
const searchTerm = ref('');

const filteredModes = computed(() => allModes.filter((i) => !modelValue.value.find((v) => v.id === i.id)));

function onSelect(mode: Mode) {
  modelValue.value.push(mode);
  searchTerm.value = '';
}

function removeMode(mode: Mode) {
  modelValue.value = modelValue.value.filter((i) => i.id !== mode.id);
}
</script>

<template>
  <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem v-for="mode in modelValue" :key="mode.id" :value="mode.label">
        <TagsInputItemText />
        <TagsInputItemDelete @click="removeMode(mode)" />
      </TagsInputItem>
    </div>

    <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Mode..." as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="modelValue.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
            @focus="open = true"
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="mode in filteredModes"
                :key="mode.id"
                :value="mode.label"
                @select.prevent="onSelect(mode)"
              >
                {{ mode.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>
