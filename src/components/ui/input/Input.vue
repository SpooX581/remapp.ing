<script setup lang="ts">
import { cn } from '@/lib/utils';
import { useMagicKeys, useVModel } from '@vueuse/core';
import { computed, nextTick, onMounted, useTemplateRef, type HTMLAttributes } from 'vue';

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  autoFocus?: boolean;
  step?: number;
  fastStep?: number;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<(e: 'update:modelValue', payload: string | number) => void>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const input = useTemplateRef('input');

onMounted(() => {
  nextTick(() => {
    if (props.autoFocus) {
      input.value?.focus();
    }
  });
});

const keys = useMagicKeys();

const holdingShift = computed(() => keys.shift);
</script>

<template>
  <input
    ref="input"
    v-model="modelValue"
    :step="(props.step || props.fastStep) && (holdingShift.value ? props.fastStep ?? props.step : props.step)"
    :class="
      cn(
        'input flex h-8 w-full px-3 py-2 text-sm rounded-md bg-floating text-floating border border-floating file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>

<style>
.input:focus,
.input:focus-visible {
  outline: none;
}

.input[type='number']::-webkit-inner-spin-button,
.input[type='number']::-webkit-outer-spin-button {
  appearance: none;
}

.input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
