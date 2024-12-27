<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TagsInputItem, type TagsInputItemProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItem
    v-bind="forwardedProps"
    class="tags-input-item"
    :class="cn('h-6 bg-floating-hover rounded', props.class)"
  >
    <slot />
  </TagsInputItem>
</template>

<style>
.tags-input-item {
  @apply flex items-center transition-colors;
}
</style>
