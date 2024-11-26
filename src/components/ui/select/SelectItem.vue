<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';
import { SelectItem, SelectItemIndicator, type SelectItemProps, SelectItemText, useForwardProps } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    class="select-item"
    :class="cn('rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-floating-hover', props.class)"
  >
    <span>
      <SelectItemIndicator>
        <Check />
      </SelectItemIndicator>
    </span>

    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>

<style>
.select-item {
  @apply relative flex w-full select-none items-center outline-none cursor-pointer;

  > span:first-child {
    @apply absolute left-2 flex h-3.5 w-3.5 items-center justify-center;

    svg {
      @apply h-4 w-4;
    }
  }

  > span {
    @apply text-base;
  }
}

.select-item[data-disabled] {
  @apply opacity-50 pointer-events-none cursor-default;
}
</style>
