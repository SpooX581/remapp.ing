<script setup lang="ts">
import type { Binding } from '@/lib/bindings';
import { type BindingDisplay, KIND, getBindingDisplay } from '@/lib/display';
import { shallowReactive, watch } from 'vue';

const props = defineProps<{ binding: Binding; html?: string }>();

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
  <template v-if="data.kind === KIND.TEXT">
    <span v-if="html" v-html="html" />
    <span v-else>{{ data.text }}</span>
  </template>
  <component v-else-if="data.kind === KIND.ICON" :is="data.icon" />
  <div v-else-if="data.kind === KIND.TEXT_ICON" class="flex items-center">
    <span v-if="html" v-html="html" />
    <span v-else>{{ data.text }}</span>
    <component :is="data.icon" />
  </div>
</template>
