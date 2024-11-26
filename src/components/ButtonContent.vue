<script setup lang="ts">
import type { Binding } from '@/lib/bindings';
import { type BindingDisplay, KIND, getBindingDisplay } from '@/lib/display';
import { shallowReactive, watch } from 'vue';

const props = defineProps<{ binding: Binding }>();

const previous: Binding | null = null;

const data = shallowReactive<BindingDisplay>({
  kind: KIND.TEXT,
  text: '',
});

function update() {
  if (props.binding === previous) return;

  Object.assign(data, getBindingDisplay(props.binding));
}

watch(props, update, { immediate: true });
</script>

<template>
  <span v-if="data.kind === KIND.TEXT">{{ data.text }}</span>
  <component v-else-if="data.kind === KIND.ICON" :is="data.icon" />
  <template v-else-if="data.kind === KIND.TEXT_ICON">
    <span>
      {{ data.text }}
    </span>
    <component :is="data.icon" />
  </template>
</template>
