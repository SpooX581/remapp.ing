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
import { computed, type HTMLAttributes } from 'vue';
import { SelectScrollDownButton, SelectScrollUpButton } from '.';

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
      class="select-content"
      :class="cn('rounded-lg border border-floating bg-floating text-floating shadow-lg', position, props.class)"
    >
      <SelectScrollUpButton />
      <SelectViewport :class="cn('p-1', position)">
        <slot />
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContent>
  </SelectPortal>
</template>

<style>
.select-content {
  @apply relative z-50 max-h-96 min-w-32 overflow-hidden;

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

  &.popper {
    &[data-side='bottom'] {
      @apply translate-y-1;
    }

    &[data-side='left'] {
      @apply -translate-x-1;
    }

    &[data-side='right'] {
      @apply translate-x-1;
    }

    &[data-side='top'] {
      @apply -translate-y-1;
    }
  }

  & [data-radix-select-viewport].popper {
    height: var(--radix-select-trigger-height);
    width: 100%;
    min-width: var(--radix-select-trigger-width);
  }
}
</style>
