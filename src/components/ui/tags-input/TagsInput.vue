<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TagsInputRoot, type TagsInputRootEmits, type TagsInputRootProps, useForwardPropsEmits } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<TagsInputRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<TagsInputRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TagsInputRoot
    v-bind="forwarded"
    class="tags-input"
    :class="cn('rounded-md border border-floating bg-floating hover:bg-floating-hover transition-colors', props.class)"
  >
    <slot />
  </TagsInputRoot>
</template>

<style>
.tags-input {
  @apply flex flex-wrap gap-2 items-center py-2 text-sm;

  &[data-empty='true'] {
    @apply gap-0;
  }

  &:hover {
    .tags-input-item {
      @apply bg-floating-active;
    }
  }
}
</style>
