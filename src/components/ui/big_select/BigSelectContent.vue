<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SelectContentProps & { class?: HTMLAttributes['class'] }>(), {
  position: 'popper',
});
const emits = defineEmits<SelectContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="cn('bigselect-content bg-white text-primary dark:bg-floating dark:text-floating', props.class)"
    >
      <SelectViewport
        :class="
          position === 'popper' && 'h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]'
        "
      >
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>

<style>
.bigselect-content {
  position: relative;
  z-index: 50;

  max-height: 48rem;
  min-width: 8rem;

  overflow: hidden;

  border-radius: 48px 48px 0 0;

  padding: 2rem 0 0 0;

  &[data-state='open'] {
    @apply animate-in fade-in-0 zoom-in-95;
  }

  &[data-state='closed'] {
    @apply animate-out fade-out-0 zoom-out-95;
  }

  &[data-side='bottom'] {
    @apply slide-in-from-top-2;
  }

  &[data-side='left'] {
    @apply slide-in-from-right-2;
  }

  &[data-side='right'] {
    @apply slide-in-from-left-2;
  }

  &[data-side='top'] {
    @apply slide-in-from-bottom-2;
  }
}
</style>
