<script setup lang="ts">
import ButtonContent from '@/components/ButtonContent.vue';
import Combobox from '@/components/Combobox.vue';
import type { Binding } from '@/lib/bindings';

defineProps<{
  options: { value: Binding; label: string }[];
}>();

const modelValue = defineModel<Binding>('modelValue');
</script>

<template>
  <Combobox :options v-model="modelValue" close-on-select>
    <template #preview="{ value }">
      <ButtonContent v-if="value" :binding="value" />
    </template>

    <template #empty>No binds found</template>

    <template #item="{ value, html }">
      <ButtonContent :binding="value" :html />
    </template>
  </Combobox>
</template>
