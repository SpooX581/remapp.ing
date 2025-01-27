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
        'tabs-trigger flex min-w-[100px] flex-grow items-center justify-center whitespace-nowrap rounded-md bg-floating px-2 py-2 text-sm font-semibold',
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

<style>
.tabs-trigger {
  @apply cursor-pointer select-none text-secondary transition-colors;
  transition-property: background-color, color, font-weight;

  &[data-state='active'] {
    @apply bg-floating-active font-bold text-floating hover:bg-floating-active;
  }

  &:hover {
    @apply bg-floating-hover;
  }

  &:disabled {
    @apply pointer-events-none opacity-50;
  }
}
</style>
