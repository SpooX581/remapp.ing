<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TabsTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'tabs-trigger w-full flex items-center justify-center whitespace-nowrap rounded-md text-floating bg-floating px-2 py-1',
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

<style>
.tabs-trigger {
  cursor: pointer;

  @apply transition-colors;
  transition-property: background-color, color, font-weight;

  &[data-state='active'] {
    background-color: var(--bg-floating-active);
    color: var(--text-primary);
    font-weight: 600;
  }

  &:hover {
    background-color: var(--bg-floating-hover);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
