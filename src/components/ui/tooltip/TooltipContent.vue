<script setup lang="ts">
import { cn } from '@/lib/utils';
import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  TooltipPortal,
  useForwardPropsEmits,
} from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TooltipContentProps & { class?: HTMLAttributes['class'] }>(), {
  sideOffset: 4,
});

const emits = defineEmits<TooltipContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="cn('tooltip rounded-md border border-floating bg-floating text-floating text-sm shadow-md', props.class)"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>

<style>
.tooltip {
  z-index: 50;
  overflow: hidden;

  @apply px-2 py-1.5 animate-in fade-in-0 zoom-in-95;
}

.tooltip[data-state='closed'] {
  @apply animate-out fade-out-0 zoom-out-95;
}

.tooltip[data-side='bottom'] {
  @apply slide-in-from-top-2;
}

.tooltip[data-side='left'] {
  @apply slide-in-from-right-2;
}

.tooltip[data-side='right'] {
  @apply slide-in-from-left-2;
}

.tooltip[data-side='top'] {
  @apply slide-in-from-bottom-2;
}

.tooltip[data-state='open'] {
  @apply animate-in fade-in-0 zoom-in-95;
}

.tooltip[data-side='bottom'] {
  @apply slide-in-from-bottom-2;
}
</style>
