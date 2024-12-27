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
        'tabs-trigger min-w-[100px] flex flex-grow items-center justify-center text-sm font-semibold whitespace-nowrap rounded-md bg-floating px-2 py-2',
        props.class,
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

<style>
.tabs-trigger {
  @apply transition-colors cursor-pointer select-none text-secondary;
  transition-property: background-color, color, font-weight;

  &[data-state='active'] {
    @apply bg-floating-active hover:bg-floating-active text-floating font-bold;
  }

  &:hover {
    @apply bg-floating-hover;
  }

  &:disabled {
    @apply pointer-events-none opacity-50;
  }
}
</style>
