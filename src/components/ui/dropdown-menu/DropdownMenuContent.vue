<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
  DropdownMenuContent,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  DropdownMenuPortal,
  useForwardPropsEmits,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = withDefaults(defineProps<DropdownMenuContentProps & { class?: HTMLAttributes['class'] }>(), {
  sideOffset: 4,
});
const emits = defineEmits<DropdownMenuContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="forwarded"
      class="dropdown-content"
      :class="cn('rounded-md border border-floating bg-floating p-1 text-floating shadow-md', props.class)"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>

<style>
.dropdown-content {
  @apply z-50 min-w-32 overflow-hidden;

  &[data-state='open'] {
    @apply animate-in fade-in-0 zoom-in-95;
  }

  &[data-state='closed'] {
    @apply animate-out fade-out-0 zoom-out-95;
  }

  &[data-side='top'] {
    @apply slide-in-from-bottom-2;
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
}
</style>
