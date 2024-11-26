<script setup lang="ts">
import ButtonContent from '@/components/ButtonContent.vue';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BINDING, type Binding } from '@/lib/bindings';
import type { GameMode } from '@/lib/modes';
import { cn } from '@/lib/utils';
import { useDeviceManager } from '@/stores/deviceManager';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const props = defineProps<{ mode: GameMode }>();

const deviceManager = useDeviceManager();

const bindings = computed(() => deviceManager.layout?.modes[props.mode]?.bindings ?? []);

const open = ref(false);
const value = ref<Binding>(BINDING.UNSPECIFIED);
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        role="combobox"
        :aria-expanded="open"
        class="w-[160px] justify-between bg-white"
      >
        <div class="bind-select-item">
          <ButtonContent :binding="value" />
        </div>

        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-[200px] p-0" align="end">
      <Command v-model="value">
        <CommandInput placeholder="Search" />

        <CommandEmpty>No binds found</CommandEmpty>

        <CommandList>
          <CommandGroup>
            <CommandItem v-for="[_, binding] in bindings" :key="binding" :value="binding" @select="open = false">
              <Check :class="cn('mr-2 h-4 w-4', value === binding ? 'opacity-100' : 'opacity-0')" />
              <div class="bind-select-item">
                <ButtonContent :binding />
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style>
.bind-select-item {
  display: flex;
  align-items: center;

  width: 100%;
  height: 1.5rem;

  > span {
    font-size: 1.25rem;
    font-weight: 500;
  }

  > svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>
