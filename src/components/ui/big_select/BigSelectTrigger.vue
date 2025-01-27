<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    class="bigselect-trigger"
    :class="
      cn(
        'bg-white text-sm data-[placeholder]:text-[#414141] dark:bg-floating dark:hover:bg-floating-hover',
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-4 w-4 shrink-0 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>

<style>
button.bigselect-trigger {
  display: flex;

  align-items: center;
  justify-content: space-between;

  height: 88px;

  padding: 0.75rem 0.5rem;

  border-radius: 48px;

  text-align: start;

  transition-property: border-radius, background-color;
  transition-duration: 50ms;
  transition-timing-function: ease-in-out;
}

.bigselect-trigger:focus {
  outline: none;
}

.bigselect-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button.bigselect-trigger[data-state='open'] {
  border-radius: 0 0 48px 48px;
}

.bigselect-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
