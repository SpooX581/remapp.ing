<script setup lang="ts">
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest text-tertiary', props.class)">
    <slot />
  </span>
</template>
