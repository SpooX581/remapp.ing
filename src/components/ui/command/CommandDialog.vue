<script setup lang="ts">
import Command from '@/components/ui/command/Command.vue';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { DialogRootEmits, DialogRootProps } from 'radix-vue';
import { useForwardPropsEmits } from 'radix-vue';

const props = defineProps<DialogRootProps>();
const emits = defineEmits<DialogRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <Dialog v-bind="forwarded">
    <DialogContent class="overflow-hidden p-0 shadow-lg">
      <Command>
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>

<style>
.command [cmdk-group-heading] {
  @apply px-2 font-medium text-neutral-500 dark:text-neutral-400;
}

.command [cmdk-group]:not([hidden]) ~ [cmdk-group] {
  @apply pt-0;
}

.command [cmdk-group] {
  @apply px-2;
}

.command [cmdk-input-wrapper] svg {
  @apply h-5 w-5;
}

.command [cmdk-input] {
  @apply h-12;
}

.command [cmdk-item] {
  @apply px-2 py-3;
}

.command [cmdk-item] svg {
  @apply h-5 w-5;
}
</style>
