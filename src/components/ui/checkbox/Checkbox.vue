<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn(
        'peer size-5 shrink-0 rounded-md border border-floating bg-floating text-floating transition-colors hover:bg-floating-hover focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-floating-active',
        props.class,
      )
    "
  >
    <CheckboxIndicator class="flex h-full w-full items-center justify-center text-current">
      <slot>
        <Check class="size-5" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
