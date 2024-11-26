<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { ComboboxContentEmits, ComboboxContentProps } from 'radix-vue';
import { ComboboxContent, useForwardPropsEmits } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = withDefaults(defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>(), {
  dismissable: false,
});
const emits = defineEmits<ComboboxContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ComboboxContent
    v-bind="forwarded"
    class="combobox-content"
    :class="cn('max-h-[300px] overflow-y-auto overflow-x-hidden', props.class)"
  >
    <div role="presentation">
      <slot />
    </div>
  </ComboboxContent>
</template>

<style>
.combobox-content {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--bg-floating-active);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--bg-tertiary);
    border-radius: 1rem;
  }
}
</style>
