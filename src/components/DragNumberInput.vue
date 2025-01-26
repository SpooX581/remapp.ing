<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEventListener, useMagicKeys } from '@vueuse/core';
import { computed, onUnmounted, useTemplateRef } from 'vue';

const props = defineProps<{
  modelValue?: string | number;
  label: string;

  slowStep?: number;
  step?: number;
  fastStep?: number;

  min?: number;
  max?: number;
}>();

const modelValue = defineModel<string | number>('modelValue');

let mouseDown = false;

const normalStep = computed(() => props.step ?? 1);
const fastStep = computed(() => props.fastStep ?? normalStep.value * 10);
const slowRatio = computed(() => fastStep.value / normalStep.value);
const slowStep = computed(() => props.slowStep ?? normalStep.value / slowRatio.value);

const { shift, ctrl } = useMagicKeys();
const step = computed(() => {
  if (ctrl.value) return slowStep.value;
  if (shift.value) return fastStep.value;
  return normalStep.value;
});
const dragStep = computed(() => {
  if (ctrl.value) return fastStep.value;
  if (shift.value) return slowStep.value;
  return normalStep.value;
});

function onMouseMove(e: MouseEvent) {
  if (!mouseDown) return;

  const value = Number(props.modelValue) + (e.movementX / 10) * dragStep.value * 10;

  const clamped = Math.min(
    Math.max(value, props.min ?? Number.NEGATIVE_INFINITY),
    props.max ?? Number.POSITIVE_INFINITY,
  );

  modelValue.value = Number(clamped.toFixed(2));
}

const label = useTemplateRef<HTMLElement>('label');

useEventListener(label, 'mousedown', () => {
  if (!mouseDown) {
    mouseDown = true;
    document.addEventListener('mousemove', onMouseMove);
  }
});

useEventListener('mouseup', () => {
  if (mouseDown) {
    mouseDown = false;
    document.removeEventListener('mousemove', onMouseMove);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
});
</script>

<template>
  <div class="flex w-full items-center">
    <Label ref="label" class="cursor-e-resize select-none px-2 py-2">{{ props.label }}</Label>
    <Input v-bind="$attrs" type="number" v-model="modelValue" :step />
  </div>
</template>
