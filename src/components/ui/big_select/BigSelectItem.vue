<script setup lang="ts">
import { cn } from '@/lib/utils';
import { SelectItem, SelectItemIndicator, type SelectItemProps, SelectItemText, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<SelectItemProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem v-bind="forwardedProps" class="bigselect-item" :class="cn('py-1.5 pl-8 pr-2 text-sm', props.class)">
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator> </SelectItemIndicator>
    </span>

    <SelectItemText class="leading-none">
      <slot />
    </SelectItemText>
  </SelectItem>
</template>

<style>
.bigselect-item {
  position: relative;
  display: flex;
  align-items: center;

  width: 100%;

  user-select: none;

  cursor: pointer;

  transition: transform 150ms;
}

.bigselect-item:focus {
  outline: none;
}

.bigselect-item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

.bigselect-item:hover {
  position: relative;
  transform: translateY(4px);
}

/* prevent the transform from moving the item out from under the cursor making it bounce */
.bigselect-item:hover::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 4px;
}
</style>
