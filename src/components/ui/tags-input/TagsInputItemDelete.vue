<script setup lang="ts">
import { cn } from '@/lib/utils';
import { X } from 'lucide-vue-next';
import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemDelete
    v-bind="forwardedProps"
    :class="cn('flex rounded bg-transparent mr-1 hover:bg-red-500', props.class)"
  >
    <slot><X class="size-4" /></slot>
  </TagsInputItemDelete>
</template>
