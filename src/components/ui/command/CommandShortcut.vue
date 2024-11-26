<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest text-neutral-500 dark:text-neutral-400', props.class)">
    <slot />
  </span>
</template>
